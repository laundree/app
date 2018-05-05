// @flow
import React from 'react'
import { connect } from 'react-redux'
// eslint-disable-next-line no-unused-vars
import type { Booking, Laundry, Machine, User, State } from 'laundree-sdk/lib/redux'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  InteractionManager,
  Image,
  Animated
} from 'react-native'
import { constants, loader, timetable, timetableTable } from '../style'
import { StateHandler } from '../stateHandler'
import { FormattedDate, FormattedMessage } from 'react-intl'
import moment from 'moment-timezone'
import DatePicker from './DatePicker'
import deepEqual from 'fast-deep-equal'
import Confirm from './modal/Confirm'
import ConfirmTwoOptions from './modal/ConfirmTwoOptions'

const cellHeight = 100

class BookingButton extends React.PureComponent<BookingButtonProps, { created: boolean }> {
  state = {created: false}
  _stylesDefault = [timetableTable.cell]
  _styleCreated = [timetableTable.cell, timetableTable.createdCell]
  _styleBooked = [timetableTable.cell, timetableTable.createdCell, timetableTable.bookedCell]
  _styleBookedOwn = [timetableTable.cell, timetableTable.createdCell, timetableTable.bookedCell, timetableTable.myBookedCell]

  _renderCellStyle () {
    if (!this.props.booking || this.props.disabled) {
      return this.state.created
        ? this._styleCreated
        : this._stylesDefault
    }
    return this.props.own
      ? this._styleBookedOwn
      : this._styleBooked
  }

  _styleBg = [timetableTable.cellBg]
  _styleBgDisabled = [timetableTable.cellBg, timetableTable.unavailableCell]

  _renderCellBgStyle () {
    return this.props.disabled
      ? this._styleBgDisabled
      : this._styleBg
  }

  _onPress = async () => {
    if (!this.props.booking) {
      this.setState({created: true})
      try {
        await this.props.onCreate()
      } finally {
        this.setState({created: false})
      }
      return
    }
    if (!this.props.own) return
    if (this.props.isBoundarySlot) {
      this.props.onPressBoundarySlot(this.props.booking, this.props.time)
      return
    }
    this.props.onPressMiddleSlot(this.props.booking)
  }

  render () {
    return (
      <View style={this._renderCellBgStyle()}>
        <Text>{this.props.time+" "+this.props.from+" "+this.props.to}</Text>
        <TouchableOpacity
          activeOpacity={0}
          onPress={this._onPress}
          style={this._renderCellStyle()}
          disabled={this.props.disabled && !this.props.booking} />
      </View>
    )
  }
}

type BookingButtonProps = {
  booking?: string,
  time?: number,
  from?: number,
  to?: number,
  own?: boolean,
  disabled?: boolean,
  onCreate: () => Promise<*>,
  onPressMiddleSlot: (id: string) => void,
  onPressBoundarySlot: (id: string, time: number) => void,
  isBoundarySlot?: boolean
}

class FadeInView extends React.PureComponent<{ duration: number, children: * }, { fadeAnim: * }> {
  state = {
    fadeAnim: new Animated.Value(0)
  }

  componentDidMount () {
    Animated.timing(
      this.state.fadeAnim,
      {
        toValue: 1,
        duration: this.props.duration
      }
    ).start()
  }

  render () {
    const {fadeAnim} = this.state
    return (
      <Animated.View
        style={{
          opacity: fadeAnim
        }}
      >
        {this.props.children}
      </Animated.View>
    )
  }
}

type TableProps = {
  laundry: Laundry,
  bookings: { [string]: Array<?{ id: string, own: boolean, from: number, to: number }> },
  userId: string,
  dateOffset: number,
  onRefresh: () => void,
  refreshing: boolean,
  machines: Machine[],
  now: moment,
  onPressMiddleSlot:(string) => void,
  onPressBoundarySlot:(string, number) => void,
  onCreate: (id: string, h: number) => Promise<*>,
}
type TableState = {
  sesh: number,
  scrolled: boolean,
  fromTime: number,
  toTime: number,
  data: { hour: number, key: string }[]
}

function hourMinuteToY (hour: number, minute: number): number {
  return hour * 2 + Math.floor(minute / 30)
}

class Table extends React.PureComponent<TableProps, TableState> {
  _initialFrom = Table._calculateFrom(this.props.laundry)
  _initialTo = Table._calculateTo(this.props.laundry)
  state = {
    sesh: 0,
    scrolled: false,
    fromTime: this._initialFrom,
    toTime: this._initialTo,
    data: Table._generateData(this._initialFrom, this._initialTo)
  }
  _ref: ?FlatList<*>

  _refPuller = r => { this._ref = r }

  static _generateData (from: number, to: number) {
    const hFrom = Math.floor(from / 2)
    const hTo = Math.ceil(to / 2) + 1
    return Array(hTo - hFrom).fill(0).map((_, i) => ({hour: (i + hFrom) * 2, key: (i + hFrom).toString()}))
  }

  static _calculateFrom (l: Laundry) {
    if (!l.rules.timeLimit) {
      return 0
    }
    const {hour, minute} = l.rules.timeLimit.from
    return hourMinuteToY(hour, minute)
  }

  static _calculateTo (l: Laundry) {
    if (!l.rules.timeLimit) {
      return 48
    }
    const {hour, minute} = l.rules.timeLimit.to
    return hourMinuteToY(hour, minute)
  }

  _nowOffset () {
    return hourMinuteToY(this.props.now.hours(), this.props.now.minutes())
  }

  _renderCell = (machineId: string, time: number) => {
    const {id, own, from, to} = this.props.bookings[machineId][time] || {own: false, id: undefined, from: undefined, to: undefined}
    const disabled = this.props.dateOffset < 0 ||
      (this.props.dateOffset === 0 && this._nowOffset() >= time) ||
      (time < this.state.fromTime) ||
      (time >= this.state.toTime)
    const isBoundarySlot = time == from || time == to
    return (
      <View style={{height: (cellHeight / 2)}}>
        <BookingButton
          disabled={disabled}
          onCreate={() => this.props.onCreate(machineId, time)}
          onPressMiddleSlot={this.props.onPressMiddleSlot}
          onPressBoundarySlot={this.props.onPressBoundarySlot}
          own={own}
          booking={id}
          time={time}
          from={id}
          to={own}
          isBoundarySlot={isBoundarySlot}
          data={{}} />
      </View>

    )
  }

  componentWillReceiveProps (props) {
    if (
      props.bookings !== this.props.bookings ||
      props.userId !== this.props.userId ||
      props.laundry !== this.props.laundry ||
      props.now !== this.props.now ||
      props.machines !== this.props.machines ||
      props.dateOffset !== this.props.dateOffset) {
      this.setState(({sesh}) => ({
        sesh: sesh + 1,
        fromTime: Table._calculateFrom(props.laundry),
        toTime: Table._calculateTo(props.laundry)
      }))
    }
  }

  _renderRow = ({item: {hour, key}}) => {
    const h1 = hour > this.state.fromTime
    const h2 = hour < this.state.toTime
    return (
      <FadeInView duration={500}>
        <View style={[timetableTable.row]}>
          {this.props.machines.map(m => (
            <View style={timetableTable.cellContainer} key={m.id}>
              {h1 ? this._renderCell(m.id, hour - 1) : null}
              {h2 ? this._renderCell(m.id, hour) : null}
            </View>
          ))}
        </View>
        {h1 && h2
          ? (
            <View style={timetableTable.marker}>
              <Text style={timetableTable.markerText}>{key}</Text>
            </View>)
          : null}
      </FadeInView>
    )
  }

  _getItemLayout = (data, index) => ({
    length: cellHeight * (index && index < 24 ? 1 : 0.5),
    offset: cellHeight * (index ? index - 0.5 : 0),
    index
  })

  _onLayout = event => {
    const {height} = event.nativeEvent.layout
    if (this.state.scrolled) return
    const ref = this._ref
    this.setState({scrolled: true}, () => {
      if (!ref) return
      const f = this.state.fromTime - (this.state.fromTime % 2) - 1
      const t = this.state.toTime + (this.state.toTime % 2) - 1
      const offset = Math.min((this._nowOffset() - f) * cellHeight / 2, (t - f) * cellHeight / 2 - height)
      console.log('Scrolling', offset)
      ref.scrollToOffset({offset, animated: false})
    })
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <FlatList
          refreshing={this.props.refreshing}
          onRefresh={this.props.onRefresh}
          onLayout={this._onLayout}
          ref={this._refPuller}
          extraData={this.state.sesh}
          getItemLayout={this._getItemLayout}
          renderItem={this._renderRow}
          data={this.state.data} />
      </View>
    )
  }
}

type TimetableProps = {
  laundry: Laundry,
  machines: { [string]: Machine },
  stateHandler: StateHandler,
  bookings: { [string]: Booking },
  user: User
}
type Data = { [string]: Array<?{ own: boolean, id: string }> }

type TimetableState = {
  showModal: boolean,
  showModalForSlots: boolean,
  i: number,
  loading: boolean,
  refreshing: boolean,
  onConfirm?: () => Promise<*>,
  onConfirmSlot?: () => Promise<*>,
  date: moment,
  machines: Machine[],
  showPicker: boolean,
  data: Data,
}

class Timetable extends React.PureComponent<TimetableProps, TimetableState> {
  _initDate = moment.tz(this.props.laundry.timezone)
  _initMachines = Timetable._buildMachines(this.props.laundry, this.props.machines)
  state = {
    loading: false,
    showModal: false,
    showModalForSlots: false,
    refreshing: false,
    date: this._initDate,
    i: 0,
    machines: this._initMachines,
    showPicker: false,
    data: Timetable._buildData(this._initDate, 0, this.props.bookings, this._initMachines, this.props.user.id)
  }

  static _buildMachines (laundry: Laundry, machines: { [string]: Machine }): Machine[] {
    return laundry.machines.reduce((acc, id) => {
      const m = machines[id]
      return m ? acc.concat(m) : acc
    }, [])
  }

  _load = () => InteractionManager.runAfterInteractions(async () => {
    console.log('Loading bookings...')
    this.setState({loading: true})
    const activeDay = this.state.date.clone().add(this.state.i, 'd')
    const activeDayPlusOne = activeDay.clone().add(1, 'd')
    await this.props.stateHandler.sdk.listBookingsInTime(this.props.laundry.id, {
      year: activeDay.year(),
      month: activeDay.month(),
      day: activeDay.date()
    }, {
      year: activeDayPlusOne.year(),
      month: activeDayPlusOne.month(),
      day: activeDayPlusOne.date()
    })
    this._updateData()
    console.log('... Bookings Loaded')
  })

  componentDidMount () {
    setInterval(() => this.setState({date: moment.tz(this.props.laundry.timezone)}), 10 * 1000)
    this._load()
    this.props.stateHandler.on('connected', this._load)
  }

  _updateData (props = this.props) {
    this.setState(({date, i, data, machines}) => {
      const newData = Timetable._buildData(date, i, props.bookings, machines, props.user.id)
      if (deepEqual(data, newData)) {
        return {loading: false, refreshing: false}
      }
      return {data: newData, loading: false, refreshing: false}
    })
  }

  componentWillReceiveProps (props) {
    this._updateData(props)
  }

  componentWillUnmount () {
    this.props.stateHandler.removeListener('connected', this._load)
  }

  _changeDay (change) {
    this.setState(({i}) => ({
      i: i + change,
      loading: true,
      data: Timetable._emptyDataSet(this.state.machines)
    }), this._load)
  }

  _onPressMiddleSlot = (id) => {
    this.setState({
      showModal: true,
      onConfirm: () => this.props.stateHandler.sdk.api.booking.del(id)
    })
  }

  _onPressBoundarySlot = (id, time) => {
    this.setState({
      showModalForSlots: true,
      onConfirm: () => this.props.stateHandler.sdk.api.booking.del(id),
      onConfirmSlot: () => this.props.stateHandler.sdk.api.booking.del(id)
    })
  }

  _onRefresh = () => {
    this.setState({loading: true, refreshing: true})
    this._load()
  }

  _onCreate = async (id, hour) => {
    console.log('Creating booking at time ' + hour)
    const fromHh = hour
    const fromDate = this.state.date.clone().add(this.state.i, 'd').minute((fromHh % 2) && 30).hour((fromHh - (fromHh % 2)) / 2)
    const from = {
      year: fromDate.year(),
      month: fromDate.month(),
      day: fromDate.date(),
      hour: fromDate.hour(),
      minute: fromDate.minute()
    }
    const to = {...from, hour: from.minute === 0 ? from.hour : from.hour + 1, minute: from.minute === 30 ? 0 : 30}
    try {
      return this.props.stateHandler.sdk.api.machine.createBooking(id, {from, to})
    } catch (err) {
      console.log(err.message)
    }
  }
  _onGoBack = () => this._changeDay(-1)
  _onGoForward = () => this._changeDay(1)
  _onShowPicker = () => this.setState({showPicker: true})
  _onHidePicker = () => this.setState({showPicker: false})
  _onPickerDateChange = date => {
    this.setState(({date: oldDate}) => {
      const newI = date.diff(oldDate.clone().startOf('d'), 'd')
      return {i: newI, showPicker: false, data: Timetable._emptyDataSet(this.state.machines)}
    }, this._load)
  }

  _onConfirm = async () => {
    if (!this.state.onConfirm) {
      return
    }
    await this.state.onConfirm()
    this._onHideModal()
  }

  _onConfirmSlot = async () => {
    if (!this.state.onConfirmSlot) {
      return
    }
    await this.state.onConfirmSlot()
    this._onHideModalTwoOptions()
  }

  _onHideModal = () => this.setState({showModal: false, onConfirm: undefined})

  _onHideModalTwoOptions = () => this.setState({showModalForSlots: false, onConfirm: undefined, onConfirmSlot: undefined})

  static _emptyDataSet (machines: Machine[]) {
    return machines.reduce((acc, {id}) => ({...acc, [id]: Array(48).fill(null)}), {})
  }

  static _buildData (date: moment, i: number, bookings: { [string]: Booking }, machines: Machine[], userId: string): Data {
    const initial = Timetable._emptyDataSet(machines)
    const d = date.clone().add(i, 'd').startOf('d')
    return Object
      .keys(bookings)
      .map(id => bookings[id])
      .reduce((matrix, booking) => {
        const fromD = -1 * (d.diff(booking.from, 'm'))
        const toD = -1 * (d.diff(booking.to, 'm'))
        for (let i = 0; i < 48; i++) {
          const minute = i * 30
          if (fromD <= minute && minute < toD) {
            matrix[booking.machine][i] = {
              id: booking.id,
              own: booking.owner === userId
            }
          }
        }
        return matrix
      }, initial)
  }

  _renderPicker () {
    if (!this.state.showPicker) {
      return null
    }
    return (
      <DatePicker
        timezone={this.props.laundry.timezone}
        date={this.state.date.clone().add(this.state.i, 'd')}
        onCancel={this._onHidePicker}
        onChange={this._onPickerDateChange} />)
  }

  _loadingStyle = {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }

  _renderLoading () {
    if (Platform.OS !== 'ios') return
    if (!this.state.loading || this.state.refreshing) return
    return (
      <View style={this._loadingStyle}>
        <ActivityIndicator color={constants.darkTheme} size={'large'} style={{flex: 1}} />
      </View>
    )
  }

  render () {
    return (
      <View style={{flex: 1}}>
        {this._renderPicker()}
        <TimetableTitle
          today={this.state.date} daysFromToday={this.state.i} onGoBack={this._onGoBack}
          onGoForward={this._onGoForward} onShowPicker={this._onShowPicker} />
        <View style={{flex: 1}}>
          <MachineTitle machines={this.state.machines} />
          <Table
            refreshing={(Platform.OS !== 'ios' && this.state.loading) || this.state.refreshing}
            onRefresh={this._onRefresh}
            dateOffset={this.state.i}
            now={this.state.date}
            bookings={this.state.data}
            userId={this.props.user.id}
            laundry={this.props.laundry}
            onPressMiddleSlot={this._onPressMiddleSlot}
            onPressBoundarySlot={this._onPressBoundarySlot}
            onCreate={this._onCreate}
            machines={this.state.machines} />
          {this._renderLoading()}
        </View>
        <Confirm
          onConfirm={this._onConfirm}
          onCancel={this._onHideModal}
          visible={this.state.showModal}
          id='general.confirm.delete.message' />
        <ConfirmTwoOptions
          onConfirm={this._onConfirm}
          onConfirmSlot={this._onConfirmSlot}
          onCancel={this._onHideModalTwoOptions}
          visible={this.state.showModalForSlots}
          id='general.confirm.delete.message' />
      </View>
    )
  }
}

const MachineTitle = (props: { machines: Machine[] }) => (
  <View style={[timetable.headerRow]}>
    {props.machines.map(machine => (
      <View style={[timetable.headerCell]} key={machine.id}>
        <Text
          style={timetable.headerText} numberOfLines={1}
          ellipsizeMode={Platform.OS === 'ios' ? 'clip' : 'tail'}>
          {(machine.name) || ''}
        </Text>
      </View>
    ))}
  </View>
)

const TimetableTitle = (props: { today: moment, daysFromToday: number, onGoBack: () => void, onGoForward: () => void, onShowPicker: () => void }) => {
  const date = props.today.clone().add(props.daysFromToday, 'd')
  return (
    <View style={timetable.titleContainer}>
      <View style={timetable.dateView}>
        <TouchableOpacity
          style={timetable.dateNavigator}
          onPress={props.onGoBack}>
          <Image
            style={timetable.arrowHeader}
            source={require('../../img/back_240_dark.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onShowPicker} style={timetable.dateHeaderTouch}>
          <Image
            style={timetable.dateHeaderImage}
            source={require('../../img/calendar_240.png')} />

          <Text style={timetable.dateHeader}>
            {props.daysFromToday === 0
              ? <FormattedMessage id='timetable.today' />
              : props.daysFromToday === 1
                ? <FormattedMessage id='timetable.tomorrow' />
                : <Text>
                  <FormattedDate value={date.toDate()} weekday='long' />
                  <Text>{' '}</Text>
                  <FormattedDate value={date.toDate()} month='numeric' day='numeric' />
                </Text>}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={timetable.dateNavigator}
          onPress={props.onGoForward}>
          <Image style={timetable.arrowHeader} source={require('../../img/forward_240.png')} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

class TimetableLoader extends React.PureComponent<TimetableProps, { loaded: boolean }> {
  state = {loaded: false}

  _load = async () => {
    console.log('Loading...')
    await this.props.stateHandler.sdk.listMachines(this.props.laundry.id)
    console.log('... Loaded')
    this.setState({loaded: true})
  }

  componentDidMount () {
    this._load()
    this.props.stateHandler.on('connected', this._load)
  }

  componentWillUnmount () {
    this.props.stateHandler.removeListener('connected', this._load)
  }

  render () {
    if (!this.state.loaded) {
      return (
        <ActivityIndicator color={constants.darkTheme} size={'large'} style={loader.activityIndicator} />
      )
    }
    return (
      <Timetable
        machines={this.props.machines}
        bookings={this.props.bookings}
        laundry={this.props.laundry}
        stateHandler={this.props.stateHandler}
        user={this.props.user} />)
  }
}

function mapStateToProps ({machines, bookings}: State): { machines: { [string]: Machine }, bookings: { [string]: Booking } } {
  return {machines, bookings}
}

const ConnectedTimetable = connect(mapStateToProps)(TimetableLoader)

export default ({laundry, user, stateHandler}: { laundry: Laundry, user: User, stateHandler: StateHandler }) => {
  if (laundry.machines.length) {
    return <ConnectedTimetable laundry={laundry} user={user} stateHandler={stateHandler} />
  }
  const owner = laundry.owners.indexOf(user.id) >= 0
  return (
    <View style={timetable.noMachinesView}>
      <Text style={timetable.noMachinesHeader}>
        <FormattedMessage id='timetable.nomachines' />
      </Text>
      {owner
        ? (
          <Text>
            <FormattedMessage id='timetable.nomachines.owner' />
          </Text>)
        : (
          <Text>
            <FormattedMessage id='timetable.nomachines.notowner' />
          </Text>)}
    </View>
  )
}

