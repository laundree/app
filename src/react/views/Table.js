/**
 * Created by soeholm on 25.02.17.
 */

import { timetableTable } from '../../style'

import React from 'react'
import {
  ListView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Platform
} from 'react-native'
import { range } from '../../utils/array'
import moment from 'moment-timezone'
import Confirm from './modal/Confirm'

function compareRows (r1, r2) {
  return (
    r1.time !== r2.time ||
    r1.index !== r2.index ||
    r1.cols.length !== r2.cols.length ||
    r1.cols.find(({disabled, booking, own, machineId}, i) => {
      const col = r2.cols[i]
      return (
        machineId !== col.machineId ||
        disabled !== col.disabled ||
        booking !== col.booking ||
        own !== col.own
      )
    })
  )
}

export default class Table extends React.Component {
  constructor (props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: compareRows})
    this.state = {
      showModal: false,
      offset: this.calculateTimesOffset(props),
      end: this.calculateTimesEnd(props),
      now: moment.tz(props.laundry.timezone),
      rowData: this.generateRows(props)
    }
  }

  confirmDeleteBooking (bookingId) {
    this.setState({
      showModal: true,
      onConfirm: () => {
        this.setState({showModal: false})
        this.deleteBooking(bookingId)
      }
    })
  }

  deleteBooking (bookingId) {
    console.log('Deleting booking: ' + bookingId)
    this.props.stateHandler.sdk
      .booking(bookingId)
      .del()
  }

  createBooking (id, hour) {
    console.log('Creating booking at time ' + hour)
    const fromHh = hour
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
  }

  componentWillReceiveProps (props) {
    if (
      this.props.machines === props.machines &&
      this.props.bookings === props.bookings &&
      this.props.laundry === props.laundry &&
      this.props.currentUser === props.currentUser &&
      this.props.date === props.date) {
      console.log('Skipping data update')
      return
    }
    this.updateData(props)
  }

  updateData (props = this.props) {
    return this.setState({
      rowData: this.generateRows(props),
      offset: this.calculateTimesOffset(props),
      end: this.calculateTimesEnd(props),
      now: moment.tz(props.laundry.timezone)
    })
  }

  componentDidMount () {
    this.timer = setInterval(() => this.updateData(), 60 * 1000)
  }

  calculateScrollTo (height) {
    const scrollTo = this.calculateIndicatorPosition() - 50
    const min = 0
    const max = (this.state.end - this.state.offset) * 50 - height
    return Math.min(Math.max(min, scrollTo), max)
  }

  scrollTo (layout) {
    if (!this.scrollView || this.scrolled) {
      return
    }
    this.scrolled = true
    this.scrollView.scrollTo({y: this.calculateScrollTo(layout.height), animated: false})
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  generateBookingMap (props) {
    return Object.keys(props.bookings)
      .map(key => props.bookings[key])
      .map(({from, to, machine, id}) => ({
        from: moment.tz(from, props.laundry.timezone),
        to: moment.tz(to, props.laundry.timezone),
        machine,
        id
      }))
      .filter(({from, to}) => to.isSameOrAfter(props.date, 'd') && from.isSameOrBefore(props.date, 'd'))
      .reduce((obj, {from, to, machine, id}) => {
        const fromY = props.date.isSame(from, 'd') ? this.dateToY(from) : 0
        const toY = props.date.isSame(to, 'd') ? this.dateToY(to) : 48
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

  render () {
    return <View style={timetableTable.container}>
      {this.renderHeader()}
      {this.renderRows()}
      <Confirm
        onConfirm={this.state.onConfirm || (() => {})}
        onCancel={() => this.setState({showModal: false})}
        visible={this.state.showModal}
        text='Are you sure that you want to delete this booking?'/>
    </View>
  }

  calculateIndicatorPosition () {
    return (48 * this.dayCoefficient(this.state.now) + (this.state.now.hours() * 2 + this.state.now.minutes() / 30) - this.state.offset) * 50
  }

  renderIndicator () {
    const indicatorPosition = this.calculateIndicatorPosition()
    return [
      <View key='1' style={[timetableTable.shadowIndicator, {height: indicatorPosition + (10 / 30 * 50)}]}/>,
      <View key='2' style={[timetableTable.indicator, {top: indicatorPosition}]}/>
    ]
  }

  renderHeader () {
    // console.log('Rendering headers')
    return <View style={timetableTable.row}>
      {this.props.laundry.machines.map(id => (
        <View style={[timetableTable.cellBg, timetableTable.headerCell]} key={id}>
          <Text
            style={timetableTable.headerText} numberOfLines={1}
            ellipsizeMode={Platform.OS === 'ios' ? 'clip' : 'tail'}>
            {(this.props.machines[id] && this.props.machines[id].name) || ''}
          </Text>
        </View>
      ))}
    </View>
  }

  renderRows () {
    return <ScrollView ref={r => (this.scrollView = r)} onLayout={evt => this.scrollTo(evt.nativeEvent.layout)}>
      {this.state.rowData.map(data => this.renderRow(data))}
      {this.renderIndicator()}
    </ScrollView>
  }

  renderRow ({time, index, cols}) {
    const marker = index && ((time + 1) % 2)
      ? <View style={timetableTable.marker}>
        <Text style={timetableTable.markerText}>{time / 2}</Text>
      </View>
      : null

    return <View key={index}>
      {marker}
      <View style={timetableTable.row}>
        {cols.map((data, i) => (
          <View key={i} style={timetableTable.cellContainer}>
            {this.renderCell(data, time)}
          </View>))}
      </View>
    </View>
  }

  renderCellStyle (data) {
    const styles = [timetableTable.cell]
    if (!data.booking) return styles
    styles.push(timetableTable.bookedCell)
    if (data.own) {
      styles.push(timetableTable.myBookedCell)
    }
    return styles
  }

  renderCellBgStyle (data) {
    const styles = [timetableTable.cellBg]
    if (!data.disabled) return styles
    return styles.concat(timetableTable.unavailableCell)
  }

  generateBookingHandler ({booking, own, machineId}, time) {
    if (!booking) {
      return () => this.createBooking(machineId, time)
    }
    if (!own) return
    return () => this.confirmDeleteBooking(booking)
  }

  renderCell (data, time) {
    return <View style={this.renderCellBgStyle(data)}>
      <TouchableOpacity
        onPress={this.generateBookingHandler(data, time)}
        style={this.renderCellStyle(data)}
        disabled={data.disabled && !data.booking}/>
    </View>
  }

  calculateTooLateKey (tooLate) {
    return 48 * this.dayCoefficient(tooLate) + tooLate.hours() * 2 + tooLate.minutes() / 30
  }

  dayCoefficient (moment) {
    if (this.props.date.isBefore(moment, 'd')) return 1
    if (this.props.date.isAfter(moment, 'd')) return -1
    return 0
  }

  calculateDeadline (props = this.props) {
    return moment.tz(props.laundry.timezone).add(10, 'minutes')
  }

  generateRows (props) {
    const deadline = this.calculateDeadline(props)
    const deadlineTime = this.calculateTooLateKey(deadline)
    const bookingMap = this.generateBookingMap(props)
    return this.generateTimes(props)
      .map((time, index) => {
        const tooLate = deadlineTime >= time
        return {
          time,
          index,
          cols: props.laundry.machines
            .map(id => {
              const broken = props.machines[id] && props.machines[id].broken
              const obj = {
                machineId: id,
                disabled: broken || tooLate
              }

              const booking = props.bookings[bookingMap[`${id}:${time}`]]

              if (!booking) {
                return obj
              }
              return Object.assign(obj, {
                booking: booking.id,
                own: booking.owner === this.props.currentUser.id
              })
            })
        }
      })
  }

  calculateTimesOffset (props = this.props) {
    if (!props.laundry.rules.timeLimit) return 0
    const {hour: fromHour, minute: fromMinute} = props.laundry.rules.timeLimit.from
    return Math.floor(fromHour * 2 + fromMinute / 30)
  }

  calculateTimesEnd (props = this.props) {
    if (!props.laundry.rules.timeLimit) return 0
    const {hour: toHour, minute: toMinute} = props.laundry.rules.timeLimit.to
    return Math.floor(toHour * 2 + toMinute / 30)
  }

  generateTimes (props) {
    return range(this.calculateTimesOffset(props), this.calculateTimesEnd(props))
  }

}

Table.propTypes = {
  stateHandler: React.PropTypes.object.isRequired,
  bookings: React.PropTypes.object.isRequired,
  laundry: React.PropTypes.object.isRequired,
  machines: React.PropTypes.object.isRequired,
  date: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object.isRequired
}
