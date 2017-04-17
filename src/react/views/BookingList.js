/**
 * Created by soeholm on 06.04.17.
 */

import React from 'react'
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity
} from 'react-native'
import moment from 'moment-timezone'
import {bookingList} from '../../style'
import Confirm from './modal/Confirm'

class BookingList extends React.Component {

  constructor (props) {
    super(props)

    console.log('Unsorted: ', this.props.bookings)
    this.state = {
      showModal: false

    }
    console.log('Sorted: ', this.props.bookings)
  }

  render () {
    const sortedBookings = this.props.bookings.sort((a, b) => { a.from.isBefore(b.from) })
    return <View style={bookingList.container}>
      <ScrollView>
        {sortedBookings.map((b, i) => this.renderBooking(b, i, sortedBookings))}
      </ScrollView>
      <Confirm
        onConfirm={this.state.onConfirm || (() => {})}
        onCancel={() => this.setState({showModal: false})}
        visible={this.state.showModal}
        text='Are you sure that you want to delete this booking?'/>
    </View>
  }

  renderBooking (booking, index, sortedBookings) {
    const bookingDate = booking.from.clone().startOf('day')
    const prevDate = index < 1 ? bookingDate : sortedBookings[index - 1].from.clone().startOf('day')

    return <View key={booking.id}>
      {!index || prevDate.isBefore(bookingDate) ? this.renderSectionHeader(bookingDate) : null}
      <TouchableOpacity
        onPress={() => this.onPress(booking)}>
        <View style={bookingList.row}>
          <View style={bookingList.time}>
            <Text style={bookingList.timeText}>{booking.from.format('HH:mm')}</Text>
            <Text style={bookingList.timeText}>{booking.to.format('HH:mm')}</Text>
          </View>
          <View style={bookingList.machine}>
            <Text>{booking.machine}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  }

  renderSectionHeader (d) {
    return <View style={bookingList.headerRow}>
      <Text style={bookingList.headerText}>{d.isSame(moment(), 'd') ? 'Today'
        : d.isSame(moment().add(1, 'day'), 'd') ? 'Tomorrow'
          : d.format('dddd D[/]M')}</Text>
    </View>
  }

  onPress (booking) {
    this.setState({
      showModal: true,
      onConfirm: () => {
        this.setState({showModal: false})
        this.deleteBooking(booking)
      }
    })
  }

  deleteBooking (booking) {
    this.props.stateHandler.sdk
      .booking(booking.id)
      .del()
  }
}

BookingList.propTypes = {
  stateHandler: React.PropTypes.object.isRequired,
  bookings: React.PropTypes.array.isRequired
}

export default class BookingListWrapper extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      date: moment.tz(this.props.laundry.timezone).startOf('day')
    }
  }

  componentWillMount () {
    // Retrieve machines
    this.props.stateHandler.sdk.listMachines(this.laundryId)
    this.fetchData()
  }

  fetchData () {
    // Retrieve bookings
    this.props.stateHandler.sdk.listBookingsForUser(this.laundryId, this.props.user.id, {to: {$gte: new Date()}})
  }

  get laundryId () {
    return this.props.laundry.id
  }

  render () {
    if (!this.props.userBookings) return null
    const bookings = this.props.userBookings
      .map(bookingId => this.renderBooking(this.props.bookings[bookingId])).filter(b => b)
    if (!bookings.length) {
      return this.renderEmpty()
    }
    return this.renderBookingList(bookings)
  }

  renderBooking (booking) {
    const machine = this.props.machines[booking.machine]
    if (!machine || machine.broken) {
      return null
    }
    const from = moment.tz(booking.from, this.props.laundry.timezone)
    return {
      id: booking.id,
      machine: this.props.machines[booking.machine].name,
      from: from,
      to: moment.tz(booking.to, this.props.laundry.timezone)
    }
  }

  renderBookingList (bookings) {
    // bookings.map((id, from, to, machine, owner) => {
    //   return {id, from, to, machine, owner}
    // })
    return <BookingList
      bookings={bookings}
      stateHandler={this.props.stateHandler}/>
  }

  renderEmpty () {
    return <View style={bookingList.noBookingsView}>
      <Text style={bookingList.headerText}>You have no active bookings</Text>
      <Text>Make a booking in the timetable</Text>
    </View>
  }

  get isLaundryOwner () {
    return this.props.laundry.owners.indexOf(this.props.user) >= 0
  }
}

BookingListWrapper.propTypes = {
  user: React.PropTypes.object.isRequired,
  laundry: React.PropTypes.object.isRequired,
  machines: React.PropTypes.object.isRequired,
  bookings: React.PropTypes.object.isRequired,
  userBookings: React.PropTypes.arrayOf(React.PropTypes.string),
  stateHandler: React.PropTypes.object.isRequired
}
