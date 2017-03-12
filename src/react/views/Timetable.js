/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  Navigator,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import moment from 'moment'
import Table from './Table'
import {timetable, timetableTable} from '../../style'
import {range} from '../../utils/array'

class Timetable extends React.Component {

  render () {
    return <View style={{
      paddingBottom: Navigator.NavigationBar.Styles.General.NavBarHeight,
      marginTop: 10,
      marginBottom: 10
    }}>
      {this.renderTitle()}
      {this.renderTable()}
    </View>
  }

  renderTitle () {
    let rightArrow = this.props.date.isSame(moment(), 'd')
      ? <Text style={timetable.dateNavigator}/> : <TouchableOpacity
        style={timetable.dateNavigator}
        onPress={(event) => this.onPressLeft(event)}>
        <Text style={timetable.arrowHeader}>{'<'}</Text>
      </TouchableOpacity>

    return <View style={timetable.row}>
      <View style={timetable.dateView}>
        {rightArrow}
        <Text style={timetable.dateHeader}>
          {this.props.date.format('dddd D[/]M')}
        </Text>
        <TouchableOpacity
          style={timetable.dateNavigator}
          onPress={(event) => this.onPressRight(event)}>
          <Text style={timetable.arrowHeader}>{'>'}</Text>
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
        tableStyles={timetableTable}
        renderBetweenMarker={(rowId) => this.renderBetweenMarker(rowId)}
        renderBetweenMarkers
        renderCell={(cellData, rowId) => this.renderCell(cellData, rowId)}
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
    let hour = this.hourAtRowId(rowId)
    return hour % 1 === 0 && parseFloat(rowId) !== 0
  }

  renderBetweenMarker (rowId) {
    // console.log('Render between marker')
    if (!rowId || !this.renderBetweenMarkersAt(rowId)) {
      // console.log('Render empty between marker')
      return <View style={timetableTable.emptyMarkerStyle}>
        <Text/>
      </View>
    }
    // console.log('Render between marker with text ' + time)
    return <View style={timetableTable.markerStyle}>
      <Text style={timetableTable.markerTextStyle}>{this.hourAtRowId(rowId)}</Text>
    </View>
  }

  hourAtRowId (rowId) {
    let hour = (parseInt(rowId) + parseInt(this.times[0])) / 2
    return hour
  }

  onPressCell ({id}, hour) {
    let bookingId = this.bookingId(id, hour * 2)
    if (bookingId && this.isBookingOwner(bookingId)) this.deleteBooking(bookingId)
    else if (!bookingId) this.createBooking(id, hour)
  }

  deleteBooking (bookingId) {
    console.log('Deleting booking: ' + bookingId)
    this.props.stateHandler.sdk
      .booking(bookingId)
      .del()
  }

  createBooking (id, hour) {
    console.log('Creating booking at time ' + hour)
    const fromHh = hour * 2
    const toHh = fromHh + 1
    const fromDate = this.props.date.clone().minute((fromHh % 2) && 30).hour((fromHh - (fromHh % 2)) / 2)
    const toDate = this.props.date.clone().minute((toHh % 2) && 30).hour((toHh - (toHh % 2)) / 2)
    this.props.stateHandler.sdk.machine(id).createBooking(
      {
        year: fromDate.year(),
        month: fromDate.month(),
        day: fromDate.date(),
        hour: fromDate.hour(),
        minute: fromDate.minute()
      },
      {
        year: toDate.year(),
        month: toDate.month(),
        day: toDate.date(),
        hour: toDate.hour(),
        minute: toDate.minute()
      }).catch(err => console.log(err))
    console.log(hour, fromDate.toISOString(), toDate.toISOString(), (fromHh - (fromHh % 2)) / 2)
  }

  renderCell (cellData, rowId) {
    let hour = this.hourAtRowId(rowId)
    let bookingId = this.bookingId(cellData.id, hour * 2)
    let booking = this.props.bookings[bookingId]
    let style = booking ? this.isBookingOwner(bookingId)
      ? [timetableTable.myBookedCellStyle] : [timetableTable.bookedCellStyle]
      : [timetableTable.freeCellStyle]
    let cellTime = this.props.date.clone().add(this.hourAtRowId(rowId), 'hour')
    let now = moment().add(10, 'minutes')
    let isMachineBroken = this.props.machines[cellData.id].broken

    if ((cellTime.isSameOrBefore(now, 'minutes') && !cellTime.isSameOrAfter(now, 'minutes')) || isMachineBroken) {
      style.push(timetableTable.freeCellStyleGrey)
      return <View style={style}>
        <Text/>
      </View>
    }

    return <TouchableOpacity
      style={style}
      onPress={(event) => this.onPressCell(cellData, hour)}>
      <Text/>
    </TouchableOpacity>
  }

  isBookingOwner (bookingId) {
    let booking = this.props.bookings[bookingId]
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
      .filter(({from, to}) => to.isSameOrAfter(this.props.date, 'd') && from.isSameOrBefore(this.props.date, 'd'))
      .reduce((obj, {from, to, machine, id}) => {
        const fromY = this.props.date.isSame(from, 'd') ? this.dateToY(from) : 0
        const toY = this.props.date.isSame(to, 'd') ? this.dateToY(to) : 48
        range(fromY, toY).forEach((y) => {
          let key = `${machine}:${y}`
          obj[key] = id
        })
        return obj
      }, {})
  }

  dateToY (date) {
    return Math.floor((date.hours() * 60 + date.minutes()) / 30)
  }

}

Timetable.propTypes = {
  date: React.PropTypes.object.isRequired,
  onChangeDate: React.PropTypes.func.isRequired,
  laundry: React.PropTypes.object.isRequired,
  machines: React.PropTypes.object,
  stateHandler: React.PropTypes.object.isRequired,
  bookings: React.PropTypes.object,
  user: React.PropTypes.object.isRequired
}

export default class TimetableWrapper extends React.Component {

  constructor () {
    super()
    this.state = {
      date: moment().startOf('day')
    }
  }

  componentWillMount () {
    this.fetchData()
  }

  fetchData () {
    // Retrieve machines
    this.props.stateHandler.sdk.listMachines(this.laundryId)

    // Retrieve bookings
    let tomorrow = this.state.date.clone().add(1, 'day')

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
    return <View style={timetable.container}>
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
    return <View style={timetable.container}>
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

