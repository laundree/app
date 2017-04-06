/**
 * Created by soeholm on 06.04.17.
 */

import React from 'react'
import {
  Text,
  ListView,
  View,
  Dimensions,
} from 'react-native'
import moment from 'moment-timezone'
import {bookingList} from '../../style'

class BookingList extends React.Component {

  constructor (props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.isSame(r2, 'd')})

    this.state = {
      data: this.ds.cloneWithRows(this.props.bookings)
    }
  }

  renderBooking (booking) {
    console.log('Booking: ', booking)
    const from = moment.tz(booking.booking.from, booking.laundry.timezone)
    const to = moment.tz(booking.booking.to, booking.laundry.timezone)
    return <View style={{width: Dimensions.get('window').width, flex: 1}}>
      <Text>{from.hour() + ':' + from.minute()}</Text>
      <Text>{to.hour() + ':' + to.minute()}</Text>
      <Text>{booking.machine.name}</Text>
    </View>
  }

  render () {
    console.log('Bookings', this.props.bookings)
    return <View>
      <ListView
        dataSource={this.state.data}
        renderRow={booking => this.renderBooking(booking)}
        enableEmptySections
      />
    </View>
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
    return {
      laundry: this.props.laundry,
      machine: this.props.machines[booking.machine],
      booking: booking}
  }

  renderBookingList (bookings) {
    return <View style={bookingList.container}>
      <BookingList
        date={this.state.date.clone()}
        user={this.props.user}
        bookings={bookings}
        userBookings={this.props.userBookings}
        stateHandler={this.props.stateHandler}/>
    </View>
  }

  renderEmpty () {
    return <View style={bookingList.container}>
      <Text>
        You have no bookings yet.
      </Text>
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