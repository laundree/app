// @flow

import { timetableTable } from '../../style'

import React from 'react'
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { range } from '../../utils/array'
import moment from 'moment-timezone'
import type { Col, Booking, Machine, User, Laundry } from '../../reduxTypes'
import type { StateHandler } from '../../stateHandler'

type Props = {
  stateHandler: StateHandler,
  bookings: Col<Booking>,
  laundry: Laundry,
  machines: Col<Machine>,
  date: moment,
  currentUser: User,
  offset: number,
  end: number,
  deleted: { [string]: boolean },
  onDelete: (id: string) => void
}
type Colu = { booking?: string, own?: boolean, machineId: string, disabled?: boolean }
type Row = { time: moment, index: number, cols: Colu[] }

type State = {
  now: moment,
  rowData: Row[]
}

export default class Table extends React.Component<void, Props, State> {

  state: State
  timer: number

  constructor (props: Props) {
    super(props)
    this.state = {
      now: moment.tz(props.laundry.timezone),
      rowData: this.generateRows(props)
    }
  }

  createBooking (id: string, hour: number) {
    console.log('Creating booking at time ' + hour)
    const fromHh = hour
    const fromDate = this.props.date.clone().minute((fromHh % 2) && 30).hour((fromHh - (fromHh % 2)) / 2)
    const from = {
      year: fromDate.year(),
      month: fromDate.month(),
      day: fromDate.date(),
      hour: fromDate.hour(),
      minute: fromDate.minute()
    }
    const to = {...from, hour: from.minute === 0 ? from.hour : from.hour + 1, minute: from.minute === 30 ? 0 : 30}
    return this.props.stateHandler.sdk.machine(id)
      .createBooking(from, to)
  }

  componentWillReceiveProps (props: Props) {
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

  updateData (props: Props) {
    return this.setState({
      rowData: this.generateRows(props),
      now: moment.tz(props.laundry.timezone)
    })
  }

  componentDidMount () {
    this.timer = setInterval(() => this.updateData(this.props), 60 * 1000)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  generateBookingMap (props: Props) {
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

  dateToY (date: moment) {
    return Math.floor((date.hours() * 60 + date.minutes()) / 30)
  }

  render () {
    return <View style={timetableTable.container}>
      {this.renderRows()}
    </View>
  }

  calculateIndicatorPosition () {
    return (48 * this.dayCoefficient(this.state.now) + (this.state.now.hours() * 2 + this.state.now.minutes() / 30) - this.props.offset) * 50
  }

  renderIndicator () {
    const indicatorPosition = this.calculateIndicatorPosition()
    return [
      <View key='1' style={[timetableTable.shadowIndicator, {height: indicatorPosition + (10 / 30 * 50)}]}/>,
      <View key='2' style={[timetableTable.indicator, {top: indicatorPosition}]}/>
    ]
  }

  renderRows () {
    return <View>
      {this.state.rowData.map(data => this.renderRow(data))}
      {this.renderIndicator()}
    </View>
  }

  renderRow ({time, index, cols}: Row) {
    const marker = (index - 1) && (time % 2)
      ? (
        <View style={timetableTable.marker}>
          <Text style={timetableTable.markerText}>{(time - 1) / 2}</Text>
        </View>)
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

  renderCell (data: Colu, time: moment) {
    return <BookingButton
      deleted={this.props.deleted}
      data={data} onCreate={() => this.createBooking(data.machineId, time)}
      onDelete={this.props.onDelete}/>
  }

  calculateTooLateKey (tooLate: moment) {
    return 48 * this.dayCoefficient(tooLate) + tooLate.hours() * 2 + tooLate.minutes() / 30
  }

  dayCoefficient (moment: moment) {
    if (this.props.date.isBefore(moment, 'd')) return 1
    if (this.props.date.isAfter(moment, 'd')) return -1
    return 0
  }

  calculateDeadline (props: Props) {
    return moment.tz(props.laundry.timezone).add(10, 'minutes')
  }

  generateRows (props: Props) {
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
              return {...obj, booking: booking.id, own: booking.owner === this.props.currentUser.id}
            })
        }
      })
  }

  generateTimes (props: Props) {
    return range(props.offset, props.end)
  }
}

class BookingButton extends React.Component {
  props: {
    deleted: { [string]: boolean },
    data: Colu,
    onCreate: () => Promise<*>,
    onDelete: (id: string) => void
  }
  state: { created: boolean } = {created: false}

  renderCellStyle (data: Colu) {
    const styles = [timetableTable.cell]
    if (!data.booking || data.disabled) {
      if (this.state.created) {
        styles.push(timetableTable.createdCell)
        return styles
      }
      return styles
    }
    const b = data.booking
    styles.push(timetableTable.bookedCell)
    if (data.own) {
      styles.push(timetableTable.myBookedCell)
      if (this.props.deleted[b]) {
        styles.push(timetableTable.deletedCell)
      }
    }
    return styles
  }

  static renderCellBgStyle (data: Colu) {
    const styles = [timetableTable.cellBg]
    if (!data.disabled) return styles
    return styles.concat(timetableTable.unavailableCell)
  }

  generateBookingHandler ({booking, own}: Colu) {
    if (!booking) {
      return async () => {
        this.setState({created: true})
        try {
          await this.props.onCreate()
        } finally {
          this.setState({created: false})
        }
      }
    }
    if (!own) {
      return
    }
    const b = booking
    return () => this.props.onDelete(b)
  }

  render () {
    return (
      <View style={BookingButton.renderCellBgStyle(this.props.data)}>
        <TouchableOpacity
          activeOpacity={0}
          onPress={this.generateBookingHandler(this.props.data)}
          style={this.renderCellStyle(this.props.data)}
          disabled={this.props.data.disabled && !this.props.data.booking}/>
      </View>
    )
  }

}
