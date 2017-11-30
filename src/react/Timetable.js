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
  InteractionManager
} from 'react-native'
import { constants, loader, timetable, timetableTable } from '../style'
import { StateHandler } from '../stateHandler'
import { FormattedMessage } from 'react-intl'
import { DateTime } from 'luxon'

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
  date: string,
  laundry: Laundry,
  stateHandler: StateHandler,
  deleted: { [string]: boolean },
  machines: Machine[],
  onDelete: (string) => void,
  onScroll: (number) => void
}

class Table extends React.PureComponent<TableProps> {
  _ref: ?FlatList<*>

  _renderCell = (machineId: string, time: number) => {
    return (
      <View style={{height: (cellHeight / 2)}}>
        <BookingButton
          deleted={this.props.deleted}
          onCreate={this._generateCreateBookingHandler(machineId, time)}
          onDelete={this.props.onDelete}
          data={{}} />
      </View>

    )
  }

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

  render () {
    return (
      <FlatList
        ref={this._refPuller}
        onMomentumScrollEnd={this._scrollEnd}
        getItemLayout={(data, index) => ({
          length: cellHeight * (index && index < 24 ? 1 : 0.5),
          offset: cellHeight * (index ? index - 0.5 : 0),
          index
        })}
        renderItem={this._renderRow}
        data={this._data} />
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

type TimetableState = {
  width: number,
  i: number,
  date: DateTime,
  loaded: boolean,
  rowOffset: number
}
type Data = { i: number, key: string }

const data: Data[] = Array(356).fill(0).map((z, i: number) => ({i, key: i.toString()}))

class Timetable extends React.PureComponent<TimetableProps, TimetableState> {
  _ref: ?FlatList<*>
  state = {
    width: Dimensions.get('window').width,
    i: 0,
    loaded: false,
    rowOffset: 0,
    date: DateTime.fromObject({timeZone: this.props.laundry.timezone}).startOf('day')
  }

  _listener = () => {
    const width = Dimensions.get('window').width
    this.setState({width}, this._resetScroll)
  }
  _loader = () => this.load()

  async load () {
    console.log('Loading bookings...')
    const today = this.state.date.plus({days: this.state.i})
    const tomorrow = today.plus({days: 1})
    console.log({
      year: today.year,
      month: today.month,
      day: today.day
    }, {
      year: tomorrow.year,
      month: tomorrow.month,
      day: tomorrow.day
    })
    await this.props.stateHandler.sdk.listBookingsInTime(this.props.laundry.id, {
      year: today.year,
      month: today.month,
      day: today.day
    }, {
      year: tomorrow.year,
      month: tomorrow.month,
      day: tomorrow.day
    })
    console.log('... Bookings Loaded')
    this.setState({loaded: true})
  }

  componentDidMount () {
    this.load().catch(err => console.log(err))
    this.props.stateHandler.on('connected', this._loader)
    Dimensions.addEventListener('change', this._listener)
    setTimeout(this._resetScroll, 0)
  }

  componentWillUnmount () {
    this.props.stateHandler.removeListener('connected', this._loader)
    Dimensions.removeEventListener('change', this._listener)
  }

  _resetScroll = () => {
    if (!this._ref) return
    this._ref.scrollToIndex({index: this.state.i})
  }

  _slide = (e) => {
    const x = e.nativeEvent.contentOffset.x
    const i = Math.round(x / this.state.width)
    this.setState({i}, () => InteractionManager.runAfterInteractions(() => this.load()))
  }

  _renderItem (d: Data) {
    const iso: string = this.state.date.plus({days: d.i}).toISO()
    return (
      <View style={{flex: 1, width: this.state.width}}>
        {this.renderHeader()}
        <Table
          onDelete={() => {}}
          laundry={this.props.laundry}
          deleted={{}}
          date={iso}
          stateHandler={this.props.stateHandler}
          machines={this.props.laundry.machines.map(id => this.props.machines[id])}
          onScroll={(rowOffset) => this.setState({rowOffset})}
          offset={this.state.rowOffset} />
      </View>
    )
  }

  renderHeader () {
    return (
      <View style={[timetable.headerRow]}>
        {this.props.laundry.machines.map(id => (
          <View style={[timetable.headerCell]} key={id}>
            <Text
              style={timetable.headerText} numberOfLines={1}
              ellipsizeMode={Platform.OS === 'ios' ? 'clip' : 'tail'}>
              {(this.props.machines[id] && this.props.machines[id].name) || ''}
            </Text>
          </View>
        ))}
      </View>)
  }

  render () {
    return (
      <FlatList
        getItemLayout={(data, i) => ({length: this.state.width, offset: i * this.state.width, index: i})}
        onMomentumScrollEnd={this._slide}
        pagingEnabled
        style={{flex: 1}}
        horizontal
        ref={ref => this._ref = ref}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({item}) => this._renderItem(item)}
      />
    )
  }

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

