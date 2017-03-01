/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  Dimensions,
  ListView,
  Navigator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import moment from 'moment'
import Table from './Table'

const {range} = require('../../utils/array')

class Timetable extends React.Component {

  render () {
    return <View style={{
      paddingBottom: Navigator.NavigationBar.Styles.General.NavBarHeight,
      marginTop: 10, marginBottom: 10
    }}>
      {this.renderTitle()}
      {this.renderTable()}
    </View>
  }

  renderTitle () {
    let rightArrow = this.props.date.isSame(moment(),'d') ?
      <Text style={styles.dateNavigator}></Text> :
      <TouchableOpacity
        style={styles.dateNavigator}
        onPress={(event) => this.onPressLeft(event)}>
        <Text style={styles.arrowHeader}>{'<'}</Text>
      </TouchableOpacity>

    return <View style={styles.row}>
      <View style={styles.dateView}>
        {rightArrow}
        <Text style={styles.dateHeader}>
          {this.props.date.format('dddd D[/]M')}
        </Text>
        <TouchableOpacity
          style={styles.dateNavigator}
          onPress={(event) => this.onPressRight(event)}>
          <Text style={styles.arrowHeader}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  }

  onPressLeft () {
    let newDate = this.props.date.clone().subtract(1, 'day')
    this.props.onChangeDate(newDate)
  }

  onPressRight () {
    let newDate = this.props.date.clone().add(1, 'day')
    this.props.onChangeDate(newDate)
  }

  renderTable () {
    return <View>
      <Table
        headersData={this.machines}
        data={this.times}
        tableStyles={this.tableStyles}
        renderBetweenMarker={(rowId) => this.renderBetweenMarker(rowId)}
        renderBetweenMarkers={true}
        renderCell={(cellData, columnId, rowId) => this.renderCell(cellData, columnId, rowId)}
      />
    </View>
  }

  get machines () {
    if (!this.props.laundry) return undefined
    let machines = this.props.laundry.machines.map(id => {
      return this.props.machines[id]
    })
    return machines.filter(machine => machine !== null && machine !== undefined)
  }

  get times () {
    if (!this.props.laundry.rules.timeLimit) return range(48)
    const {hour: fromHour, minute: fromMinute} = this.props.laundry.rules.timeLimit.from
    const {hour: toHour, minute: toMinute} = this.props.laundry.rules.timeLimit.to
    const from = Math.floor(fromHour * 2 + fromMinute / 30)
    const to = Math.floor(toHour * 2 + toMinute / 30)
    return range(from, to)
  }

  renderBetweenMarkersAt (rowId) {
    let hour = this.hourAtRowId(rowId);
    return hour % 1 === 0 && parseFloat(rowId) !== 0
  }

  renderBetweenMarker (rowId) {
    // console.log('Render between marker')
    if (!rowId || !this.renderBetweenMarkersAt(rowId)) {
      // console.log('Render empty between marker')
      return <View style={this.tableStyles.emptyMarkerStyle}>
        <Text/>
      </View>
    }
    // console.log('Render between marker with text ' + time)
    return <View style={this.tableStyles.markerStyle}>
      <Text style={this.tableStyles.markerTextStyle}>{this.hourAtRowId(rowId)}</Text>
    </View>
  }

  hourAtRowId(rowId) {
    let hour = (parseInt(rowId)+parseInt(this.times[0]))/2
    return hour
  }

  onPressCell ({id}, hour) {
    let bookingId = this.bookingId(id, hour*2)
    if (bookingId && this.isBookingOwner(bookingId)) this.deleteBooking(bookingId)
    else if (!bookingId) this.createBooking(id, hour)
  }

  deleteBooking(bookingId) {
    console.log('Deleting booking: ' + bookingId)
    this.props.stateHandler.sdk
      .booking(bookingId)
      .del()
  }

  createBooking(id, hour) {
    console.log('Creating booking at time ' + hour)
    const fromHh = hour * 2
    const toHh = fromHh + 1
    const fromDate = this.props.date.clone().minute((fromHh % 2) && 30).hour((fromHh - (fromHh % 2)) / 2)
    const toDate = this.props.date.clone().minute((toHh % 2) && 30).hour((toHh - (toHh % 2)) / 2)
    this.props.stateHandler.sdk.machine(id).createBooking(
      {year: fromDate.year(), month: fromDate.month(), day: fromDate.date(), hour: fromDate.hour(), minute: fromDate.minute()},
      {year: toDate.year(), month: toDate.month(), day: toDate.date(), hour: toDate.hour(), minute: toDate.minute()}).catch(err => console.log(err))
    console.log(hour, fromDate.toISOString(), toDate.toISOString(), (fromHh - (fromHh % 2)) / 2)
  }

  renderCell (cellData, columnId, rowId) {
    let hour = this.hourAtRowId(rowId)
    let bookingId = this.bookingId(cellData.id, hour*2)
    let booking = this.props.bookings[bookingId];
    let style = booking ? this.isBookingOwner(bookingId) ?
        [this.tableStyles.myBookedCellStyle] : [this.tableStyles.bookedCellStyle]
      : [this.tableStyles.freeCellStyle]
    let cellTime = this.props.date.clone().add(this.hourAtRowId(rowId),'hour')
    let now = moment().add(10,'minutes')
    let isMachineBroken = this.props.machines[cellData.id].broken

    if ((cellTime.isSameOrBefore(now,'minutes') && !cellTime.isSameOrAfter(now, 'minutes')) || isMachineBroken) {
      style.push(this.tableStyles.freeCellStyleGrey)
      return <View style={style}>
        <Text></Text>
      </View>
    }

    return <TouchableOpacity
      style={style}
      onPress={(event) => this.onPressCell(cellData, hour)}>
      <Text></Text>
    </TouchableOpacity>
  }

  isBookingOwner(bookingId) {
    let booking = this.props.bookings[bookingId];
    if (!booking) return false
    return booking.owner === this.props.user.id
  }

  bookingId (machineId, rowId) {
    return this.bookings[`${machineId}:${rowId}`]
  }

  get bookings () {
    return Object.keys(this.props.bookings)
      .map(key => this.props.bookings[key])
      .map(({from, to, machine, id}) => ({
        from: moment(from),
        to: moment(to),
        machine,
        id
      }))
      .filter(({from, to}) => to.isSameOrAfter(this.props.date, 'd')
      && from.isSameOrBefore(this.props.date, 'd'))
      .reduce((obj, {from, to, machine, id}) => {
        const fromY = this.props.date.isSame(from, 'd') ? this.dateToY(from) : 0
        const toY = this.props.date.isSame(to, 'd') ? this.dateToY(to) : 48
        range(fromY, toY).forEach((y) => {
          let key = `${machine}:${y}`;
          obj[key] = id
        })
        return obj
      }, {})
  }

  dateToY (date) {
    return Math.floor((date.hours() * 60 + date.minutes()) / 30)
  }

  tableStyles = StyleSheet.create({
    containerStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: Dimensions.get('window').width,
      marginLeft: 10,
      marginRight: 10,
    },
    headerStyle: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: '#7DD8D5',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4DC4C1'
    },
    rowStyle: {
      flexDirection: 'row',
      width: Dimensions.get('window').width,
      height: 50
    },
    freeCellStyle: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: '#7DD8D5',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4DC4C1'
    },
    freeCellStyleGrey: {
      backgroundColor: '#4B9997',
      borderColor: '#5CA09E'
    },
    bookedCellStyle: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: '#a04444',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#a04444'
    },
    myBookedCellStyle: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: '#49a044',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#49a044'
    },
    markerStyle: {
      width: 20,
      marginTop: -9,
      height: 20
    },
    emptyMarkerStyle: {
      width: 20,
      marginTop: -9,
      height: 20,
    },
    markerTextStyle: {
      textAlign: 'center'
    }
  })

}

export default class TimetableWrapper extends React.Component {

  constructor() {
    super()
    this.state = {
      date: moment().startOf('day')
    }
  }

  componentWillMount() {
    this.fetchData()
  }

  fetchData() {
    //Retrieve machines
    this.props.stateHandler.sdk.listMachines(this.laundryId)

    //Retrieve bookings
    var tomorrow = this.state.date.clone().add(1, 'day')

    this.props.stateHandler.sdk.listBookingsInTime(this.laundryId, {
      year: this.state.date.year(),
      month: this.state.date.month(),
      day: this.state.date.date()
    }, {
      year: tomorrow.year(),
      month: tomorrow.month(),
      day: tomorrow.date()
    })
  }

  get laundryId () {
    return this.props.laundry.id
  }

  render () {
    if (!this.props.machines) {
      return this.renderEmpty()
    }
    return this.renderTables()
  }

  renderTables () {
    return <View style={styles.container}>
      <Timetable date={this.state.date.clone()}
                 onChangeDate={(newDate) => this.onChangeDate(newDate)}
                 user={this.props.user}
                 laundry={this.props.laundry}
                 machines={this.props.machines}
                 bookings={this.props.bookings}
                 stateHandler={this.props.stateHandler}/>
    </View>
  }

  onChangeDate (newDate) {
    this.setState({
      date: newDate
    }, this.fetchData)
  }

  renderEmpty () {
    return <View style={styles.container}>
      <Text>
        There are no machines registered.
      </Text>
      {this.isLaundryOwner ? <Text>
          Go to the website and register machines.
        </Text> : <Text>
          Ask your administrator to register machines.
        </Text>}
    </View>
  }

  get isLaundryOwner () {
    if (this.props.laundry) return this.props.laundry.owners.indexOf(this.props.user) >= 0
    return undefined
  }
}

TimetableWrapper.propTypes = {
  user: React.PropTypes.object.isRequired,
  laundry: React.PropTypes.object.isRequired,
  machines: React.PropTypes.object,
  bookings: React.PropTypes.object,
  stateHandler: React.PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#66D3D3',
  },
  dateView: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width
  },
  arrowHeader: {
    fontSize: 20,
    textAlign: 'center'
  },
  dateHeader: {
    fontSize: 20,
    textAlign: 'center',
    width: Dimensions.get('window').width/2
  },
  dateNavigator: {
    flex: 2,
  },
  row: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: 50
  }
})