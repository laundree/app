// @flow
import React from 'react'
import { connect } from 'react-redux'
import type { Booking, Laundry, Machine, State, User } from 'laundree-sdk/lib/redux'
import {
  FlatList,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  InteractionManager,
  Image
} from 'react-native'
import { constants, loader, timetable, timetableTable } from '../style'
import { StateHandler } from '../stateHandler'
import { FormattedDate, FormattedMessage } from 'react-intl'
import moment from 'moment-timezone'
import DatePicker from './DatePicker'
import deepEqual from 'fast-deep-equal'

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
    this.props.onDelete(this.props.booking)
  }

  render () {
    return (
      <View style={this._renderCellBgStyle()}>
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
  own?: boolean,
  disabled?: boolean,
  onCreate: () => Promise<*>,
  onDelete: (id: string) => void
}

type TableProps = {
  laundry: Laundry,
  bookings: { [string]: Array<?{ id: string, own: boolean }> },
  userId: string,
  machines: Machine[],
  onDelete: (string) => void,
  onCreate: (id: string, h: number) => Promise<void>,
}

type TableState = {
  sesh: number
}

class Table extends React.PureComponent<TableProps, TableState> {
  state = {
    sesh: 0
  }
  _renderCell = (machineId: string, time: number) => {
    const {id, own} = this.props.bookings[machineId][time] || {own: false, id: undefined}
    return (
      <View style={{height: (cellHeight / 2)}}>
        <BookingButton
          onCreate={() => this.props.onCreate(machineId, time)}
          onDelete={this.props.onDelete}
          own={own}
          booking={id}
          data={{}} />
      </View>

    )
  }

  componentWillReceiveProps (props) {
    if (
      props.bookings !== this.props.bookings ||
      props.userId !== this.props.userId ||
      props.laundry !== this.props.laundry ||
      props.machines !== this.props.machines) {
      this.setState(({sesh}) => ({sesh: sesh + 1}))
    }
  }

  _renderRow = ({item: {hour, key}}) => {
    const start = hour >= 0
    const end = hour <= 46
    return (
      <View>
        <View style={[timetableTable.row]}>
          {this.props.machines.map(m => (
            <View style={timetableTable.cellContainer} key={m.id}>
              {start ? this._renderCell(m.id, hour) : null}
              {end ? this._renderCell(m.id, hour + 1) : null}
            </View>
          ))}
        </View>
        {start && end
          ? (
            <View style={timetableTable.marker}>
              <Text style={timetableTable.markerText}>{key}</Text>
            </View>)
          : null}
      </View>
    )
  }

  _data: { hour: number, key: string }[] = Array(25).fill(0).map((z, key: number) => ({
    key: key.toString(),
    hour: key * 2 - 1
  }))

  _getItemLayout = (data, index) => ({
    length: cellHeight * (index && index < 24 ? 1 : 0.5),
    offset: cellHeight * (index ? index - 0.5 : 0),
    index
  })

  render () {
    return (
      <View style={{flex: 1}}>
        <FlatList
          extraData={this.state.sesh}
          getItemLayout={this._getItemLayout}
          renderItem={this._renderRow}
          data={this._data} />
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
  i: number,
  date: moment,
  width: number,
  machines: Machine[],
  showPicker: boolean,
  data: Data,
}

class Timetable extends React.PureComponent<TimetableProps, TimetableState> {
  _initDate = moment.tz(this.props.laundry.timezone).startOf('day')
  _initMachines = Timetable._buildMachines(this.props.laundry, this.props.machines)
  state = {
    date: this._initDate,
    i: 0,
    width: Dimensions.get('window').width,
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

  _listener = () => {
    const width = Dimensions.get('window').width
    this.setState({width})
  }

  _load = () => InteractionManager.runAfterInteractions(async () => {
    console.log('Loading bookings...')
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
    this._load()
    this.props.stateHandler.on('connected', this._load)
    Dimensions.addEventListener('change', this._listener)
  }

  _updateData (props = this.props) {
    this.setState(({date, i, data, machines}) => {
      const newData = Timetable._buildData(date, i, props.bookings, machines, props.user.id)
      if (deepEqual(data, newData)) {
        return {}
      }
      return {data: newData}
    })
  }

  componentWillReceiveProps (props) {
    this._updateData(props)
  }

  componentWillUnmount () {
    this.props.stateHandler.removeListener('connected', this._load)
    Dimensions.removeEventListener('change', this._listener)
  }

  _changeDay (change) {
    this.setState(({i}) => ({i: i + change}), this._load)
  }

  _onDelete = (id) => {
    console.log('Deleting', id)
    this.props.stateHandler.sdk.api.booking.del(id)
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
    console.log(from, to)
    try {
      return this.props.stateHandler.sdk.api.machine.createBooking(id, {from, to})

    } catch(err) {
      console.log(Object.keys(err))
    }
  }

  static _buildData (date: moment, i: number, bookings: { [string]: Booking }, machines: Machine[], userId: string): Data {
    const initial = machines.reduce((acc, {id}) => ({...acc, [id]: Array(48).fill(null)}), {})
    const d = date.clone().add(i, 'd')
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
              from: booking.from,
              to: booking.to,
              own: booking.owner === userId
            }
          }
        }
        return matrix
      }, initial)
  }

  _onGoBack = () => this._changeDay(-1)
  _onGoForward = () => this._changeDay(1)
  _onShowPicker = () => this.setState({showPicker: true})
  _onHidePicker = () => this.setState({showPicker: false})
  _onPickerDateChange = date => {
    this.setState(({date: oldDate}) => {
      const newI = date.diff(oldDate.clone(), 'd')
      return {i: newI, showPicker: false}
    }, this._load)
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

  render () {
    return (
      <View style={{flex: 1}}>
        {this._renderPicker()}
        <TimetableTitle
          today={this.state.date} daysFromToday={this.state.i} onGoBack={this._onGoBack}
          onGoForward={this._onGoForward} onShowPicker={this._onShowPicker} />
        <View style={{flex: 1, width: this.state.width}}>
          <MachineTitle machines={this.state.machines} />
          <Table
            bookings={this.state.data}
            userId={this.props.user.id}
            laundry={this.props.laundry}
            onDelete={this._onDelete}
            onCreate={this._onCreate}
            machines={this.state.machines} />
        </View>
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

