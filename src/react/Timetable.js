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

const cellHeight = 100

type BookingButtonProps = {
  data: { booking?: string, own?: boolean, disabled?: boolean },
  deleted: { [string]: boolean },
  onCreate: () => Promise<*>,
  onDelete: (id: string) => void
}

class BookingButton extends React.PureComponent<BookingButtonProps, { created: boolean }> {
  state = {created: false}

  _renderCellStyle (data) {
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

  static _renderCellBgStyle (data) {
    const styles = [timetableTable.cellBg]
    if (!data.disabled) return styles
    return styles.concat(timetableTable.unavailableCell)
  }

  _generateBookingHandler ({booking, own}) {
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
      <View style={BookingButton._renderCellBgStyle(this.props.data)}>
        <TouchableOpacity
          activeOpacity={0}
          onPress={this._generateBookingHandler(this.props.data)}
          style={this._renderCellStyle(this.props.data)}
          disabled={this.props.data.disabled && !this.props.data.booking} />
      </View>
    )
  }
}

type TableProps = {
  offset: number,
  laundry: Laundry,
  deleted: { [string]: boolean },
  machines: Machine[],
  onDelete: (string) => void,
  onCreate: (id: string, h: number) => Promise<void>,
  onScroll: (number) => void
}

class Table extends React.PureComponent<TableProps> {
  _ref: ?FlatList<*>
  _renderCell = (machineId: string, time: number) => {
    return (
      <View style={{height: (cellHeight / 2)}}>
        <BookingButton
          deleted={this.props.deleted}
          onCreate={() => this.props.onCreate(machineId, time)}
          onDelete={this.props.onDelete}
          data={{}} />
      </View>

    )
  }

  /*
    _generateCreateBookingHandler (id: string, h: number) {
      return async () => {
        console.log('Creating booking at time ' + h)
        const today = DateTime.fromISO(this.props.date)
        const fromHh = h
        const minute = (fromHh % 2) && 30
        const hour = (fromHh - (fromHh % 2)) / 2
        const fromDate = today.set({hour, minute})
        const from = {
          year: fromDate.year,
          month: fromDate.month,
          day: fromDate.day,
          hour: fromDate.hour,
          minute: fromDate.minute
        }
        const to = {...from, hour: from.minute === 0 ? from.hour : from.hour + 1, minute: from.minute === 30 ? 0 : 30}
        try {
          await this.props.stateHandler.sdk.api.machine.createBooking(id, {from, to})
        } catch (err) {
          console.log(err.message, err.response.body, {from, to})
        }
      }
    }
  */

  componentDidMount () {
    setTimeout(() => {
      if (!this._ref) return
      this._ref.scrollToOffset({offset: this.props.offset, animated: false}), 0
    })
  }

  _renderRow = ({item: {hour, key}}) => {
    const fullPipe = hour >= 0 && hour <= 46
    return (
      <View>
        <View style={[timetableTable.row]}>
          {this.props.machines.map(m => (
            <View style={timetableTable.cellContainer} key={m.id}>
              {fullPipe ? this._renderCell(m.id, hour) : null}
              {this._renderCell(m.id, hour + 1)}
            </View>
          ))}
        </View>
        {fullPipe
          ? (
            <View style={timetableTable.marker}>
              <Text style={timetableTable.markerText}>{key}</Text>
            </View>)
          : null}
      </View>
    )
  }

  _scrollEnd = e => {
    const y = e.nativeEvent.contentOffset.y
    this.props.onScroll(y)
  }

  componentWillReceiveProps ({offset}) {
    if (offset === this.props.offset) return
    if (!this._ref) return
    this._ref.scrollToOffset({offset, animated: false})
  }

  _refPuller = (r) => {
    this._ref = r
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
          ref={this._refPuller}
          onMomentumScrollEnd={this._scrollEnd}
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
type Data = { i: number, key: string }

type TimetableState = {
  i: number,
  date: moment,
  extraData: {
    deleted: { [string]: boolean },
    width: number,
    rowOffset: number,
    laundry: Laundry,
    machines: Machine[]
  },
  showPicker: boolean,
  data: Data[],
}

class Timetable extends React.PureComponent<TimetableProps, TimetableState> {
  _ref: ?FlatList<*>
  state = {
    extraData: {
      deleted: {},
      laundry: this.props.laundry,
      width: Dimensions.get('window').width,
      rowOffset: 0,
      machines: Timetable._buildMachines(this.props.laundry, this.props.machines),
    },
    date: moment.tz(this.props.laundry.timezone).startOf('day'),
    i: 0,
    showPicker: false,
    data: Timetable.generateData(0),
  }

  static _buildMachines (laundry: Laundry, machines: { [string]: Machine }): Machine[] {
    return laundry.machines.reduce((acc, id) => {
      const m = machines[id]
      return m ? acc.concat(m) : acc
    }, [])
  }

  _listener = () => {
    const width = Dimensions.get('window').width
    this.setState(({extraData}) => ({extraData: {...extraData, width}}))
    this._resetScroll()
  }

  _load = () => InteractionManager.runAfterInteractions(async () => {
    console.log('Loading bookings...')
    const activeDay = this.state.date.clone().add(this.state.i, 'd')
    const activeDayPlusOne = activeDay.clone().add(1, 'd')
    await this.props.stateHandler.sdk.listBookingsInTime(this.props.laundry.id, {
      year: activeDay.year,
      month: activeDay.month,
      day: activeDay.day
    }, {
      year: activeDayPlusOne.year,
      month: activeDayPlusOne.month,
      day: activeDayPlusOne.day
    })
    console.log('... Bookings Loaded')
  })

  static generateData (i: number) {
    return [-1, 0, 1].map(i => ({i, key: i.toString()}))
  }

  componentDidMount () {
    this._load()
    this.props.stateHandler.on('connected', this._load)
    Dimensions.addEventListener('change', this._listener)
    setTimeout(() => this._resetScroll(true), 0)
  }

  componentWillReceiveProps ({laundry, machines}) {
    if (laundry !== this.props.laundry || machines !== this.props.machines) {
      this.setState(({extraData}) => ({
        extraData: {
          ...extraData,
          laundry,
          machines: Timetable._buildMachines(laundry, machines)
        }
      }))
    }
  }

  componentWillUnmount () {
    this.props.stateHandler.removeListener('connected', this._load)
    Dimensions.removeEventListener('change', this._listener)
  }

  _resetScroll = (animated = false) => {
    if (!this._ref) return
    this._ref.scrollToIndex(Platform.OS === 'ios'
      ? {index: 1, animated: false}
      : {index: 1, animated: true})
  }

  _slide = (e) => {
    const x = e.nativeEvent.contentOffset.x
    const change = (Math.round(x / this.state.extraData.width)) - 1
    if (!change) {
      return
    }
    this._changeDay(change)
    this._resetScroll()
  }

  _changeDay (change) {
    this.setState(({i}) => ({i: i + change}), this._load)
  }

  _onScroll = (rowOffset) => {
    this.setState(({extraData}) => ({extraData: {...extraData, rowOffset}}))
  }
  _onDelete = () => {console.log('DELETING')}

  _onCreate = async () => {console.log('CREATING')}

  _renderItem = () => {
    return (
      <View style={{flex: 1, width: this.state.extraData.width}}>
        <MachineTitle machines={this.state.extraData.machines} />
        <Table
          laundry={this.state.extraData.laundry}
          onDelete={this._onDelete}
          deleted={this.state.extraData.deleted}
          onCreate={this._onCreate}
          machines={this.state.extraData.machines}
          onScroll={this._onScroll}
          offset={this.state.extraData.rowOffset} />
      </View>
    )
  }

  _getItemLayout = (data, i) => ({length: this.state.extraData.width, offset: i * this.state.extraData.width, index: i})

  _onGoBack = () => this._changeDay(-1)
  _onGoForward = () => this._changeDay(1)
  _onShowPicker = () => this.setState({showPicker: true})
  _onHidePicker = () => this.setState({showPicker: false})
  _onPickerDateChange = date => {
    this.setState(({date: oldDate}) => {
      const newI = date.diff(oldDate.clone(), 'd')
      return {i: newI, showPicker: false, data: Timetable.generateData(newI)}
    }, this._load)
  }

  _renderPicker () {
    if (!this.state.showPicker) {
      return null
    }
    return <DatePicker
      timezone={this.props.laundry.timezone}
      date={this.state.date.clone().add(this.state.i, 'd')}
      onCancel={this._onHidePicker}
      onChange={this._onPickerDateChange} />
  }

  render () {
    return (
      <View style={{flex: 1}}>
        {this._renderPicker()}
        <FlatList
          getItemLayout={this._getItemLayout}
          onMomentumScrollEnd={this._slide}
          pagingEnabled
          style={{flex: 1}}
          horizontal
          ref={ref => this._ref = ref}
          showsHorizontalScrollIndicator={false}
          data={this.state.data}
          extraData={this.state.extraData}
          renderItem={this._renderItem}
        />
        <TimetableTitle
          today={this.state.date} daysFromToday={this.state.i} onGoBack={this._onGoBack}
          onGoForward={this._onGoForward} onShowPicker={this._onShowPicker} />
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
  _loader = () => this.load()

  async load () {
    console.log('Loading...')
    await this.props.stateHandler.sdk.listMachines(this.props.laundry.id)
    console.log('... Loaded')
    this.setState({loaded: true})
  }

  componentDidMount () {
    this.load()
    this.props.stateHandler.on('connected', this._loader)
  }

  componentWillUnmount () {
    this.props.stateHandler.removeListener('connected', this._loader)
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

