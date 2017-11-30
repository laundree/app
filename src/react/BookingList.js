// @flow

import React from 'react'
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  InteractionManager
} from 'react-native'
import moment from 'moment-timezone'
import { bookingList, constants } from '../style'
import Confirm from './modal/Confirm'
import { FormattedDate, FormattedMessage } from 'react-intl'
import type { Booking, Machine, User, Laundry, State } from 'laundree-sdk/lib/redux'
import type { StateHandler } from '../stateHandler'
import { connect } from 'react-redux'

type RichBooking = {
  from: moment,
  to: moment,
  machineName: string,
  id: string
}

type BookingListProps = { bookings: RichBooking[], stateHandler: StateHandler, onRefresh: () => Promise<*> }
type BookingListState = { showModal: boolean, refreshing: boolean, onConfirm?: () => void, deleted: { [string]: boolean } }

class BookingList extends React.PureComponent<BookingListProps, BookingListState> {
  state = {
    showModal: false,
    deleted: {},
    refreshing: false
  }

  getSortedBookings () {
    return this.props.bookings.sort((a, b) => a.from.valueOf() - b.from.valueOf())
  }

  async refresh () {
    this.setState({refreshing: true})
    await this.props.onRefresh()
    this.setState({refreshing: false})
  }

  render () {
    const sortedBookings = this.getSortedBookings()
    return <View style={bookingList.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />}>
        <View style={bookingList.scroll}>
          {sortedBookings.map((booking, index) => this.renderBooking(booking, index, sortedBookings))}
        </View>
      </ScrollView>
      <Confirm
        onConfirm={this.state.onConfirm || (() => {})}
        onCancel={() => this.setState({showModal: false})}
        visible={this.state.showModal}
        id='general.confirm.delete' />
    </View>
  }

  renderBooking (booking, index, sortedBookings) {
    const bookingDate = booking.from.clone().startOf('day')
    const prevDate = index < 1 ? bookingDate : sortedBookings[index - 1].from.clone().startOf('day')
    const deleted = this.state.deleted[booking.id]
    return <View key={booking.id}>
      {!index || prevDate.isBefore(bookingDate) ? this.renderSectionHeader(bookingDate) : null}
      <TouchableOpacity
        disabled={deleted}
        onPress={() => this.onPress(booking)}>
        <View style={[bookingList.row, deleted && bookingList.rowDeleted]}>
          <View style={bookingList.time}>
            <Text style={bookingList.timeText}>{booking.from.format('HH:mm')}</Text>
            <Text style={bookingList.timeText}>{booking.to.format('HH:mm')}</Text>
          </View>
          <View style={bookingList.machine}>
            <Text>{booking.machineName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  }

  renderSectionHeader (d) {
    return <View style={bookingList.headerRow}>
      <Text style={bookingList.headerText}> {
        d.isSame(moment(), 'd')
          ? <FormattedMessage id='timetable.today' />
          : d.isSame(moment().add(1, 'day'), 'd')
          ? <FormattedMessage id='timetable.tomorrow' />
          : <Text>
            <FormattedDate value={d} weekday='long' />
            <Text>{' '}</Text>
            <FormattedDate value={d} month='numeric' day='numeric' />
          </Text>
      } </Text>
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

  async deleteBooking (booking) {
    this.setState(({deleted}) => {
      deleted[booking.id] = true
      return {deleted}
    })
    try {
      await this.props.stateHandler.sdk.api.booking.del(booking.id)
    } catch (_) {
      this.setState(({deleted}) => {
        deleted[booking.id] = false
        return {deleted}
      })
    }
  }
}

type BookingListWrapperProps = {
  user: User,
  laundry: Laundry,
  machines: { [string]: Machine },
  bookings: { [string]: Booking },
  userBookings: ?(string[]),
  stateHandler: StateHandler
}

type BookingListWrapperState = { date: moment }

class BookingListWrapper extends React.PureComponent<BookingListWrapperProps, BookingListWrapperState> {
  state = {
    date: moment.tz(this.props.laundry.timezone).startOf('day')
  }

  loader = () => this.fetchData()

  convertTime (dt: string): moment {
    return moment.tz(dt, this.props.laundry.timezone)
  }

  componentDidMount () {
    InteractionManager.runAfterInteractions(() => this.fetchData())
    this.props.stateHandler.on('reconnected', this.loader)
  }

  componentWillUnmount () {
    this.props.stateHandler.removeListener('reconnected', this.loader)
  }

  fetchData () {
    // Retrieve bookings
    return Promise.all([
      this.props.stateHandler.sdk.listMachines(this.props.laundry.id),
      this.props.stateHandler.sdk.listBookingsForUser(this.props.laundry.id, this.props.user.id, {to: {$gte: new Date()}})
    ])
  }

  render () {
    const userBookings = this.props.userBookings
    if (!userBookings) {
      return <ActivityIndicator color={constants.darkTheme} size='large' style={bookingList.activityIndicator} />
    }
    const bookings = userBookings
      .reduce((arr: RichBooking[], id: string): RichBooking[] => {
        const b = this.props.bookings[id]
        if (!b) {
          return arr
        }
        const machine = this.props.machines[b.machine]
        if (!machine || machine.broken) {
          return arr
        }
        return arr.concat({
          id: b.id,
          machineName: machine.name,
          from: this.convertTime(b.from),
          to: this.convertTime(b.to)
        })
      }, [])
    if (!bookings.length) {
      return <View style={bookingList.noBookingsView}>
        <Text style={bookingList.headerText}>
          <FormattedMessage id='bookinglist.nobookings.title' />
        </Text>
        <Text>
          <FormattedMessage id='bookinglist.nobookings.text' />
        </Text>
      </View>
    }
    return <BookingList
      onRefresh={() => this.fetchData()}
      bookings={bookings}
      laundry={this.props.laundry}
      stateHandler={this.props.stateHandler} />
  }
}

function mapStateToProps ({machines, bookings, userBookings}: State): { machines: { [string]: Machine }, bookings: { [string]: Booking }, userBookings: ?(string[]) } {
  return {
    machines,
    bookings,
    userBookings: userBookings ? userBookings.bookings : null
  }
}

export default connect(mapStateToProps)(BookingListWrapper)
