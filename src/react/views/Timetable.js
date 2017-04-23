// @flow

import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  InteractionManager,
  RefreshControl,
  Platform
} from 'react-native'
import moment from 'moment-timezone'
import Table from './Table'
import { timetable, loader, constants } from '../../style'
import DatePicker from './DatePicker'
import { range } from '../../utils/array'
import ViewPager from 'react-native-viewpager'
import Confirm from './modal/Confirm'
import type { User, Machine, Laundry, Booking, Col } from '../../reduxTypes'
import type { StateHandler } from '../../stateHandler'
import { FormattedDate, FormattedMessage } from 'react-intl'

type TimetableState = {
  showModal: boolean,
  showPicker: boolean,
  maxPage: number,
  page: number,
  now: moment,
  offset: number,
  end: number,
  data: ViewPager.DataSource,
  onConfirm?: () => void,
  refreshing: boolean,
  deleted: { [string]: boolean }
}

class Timetable extends React.Component {
  props: {
    date: moment,
    onRefresh: () => Promise<*>,
    onChangeDate: () => void,
    laundry: Laundry,
    machines: Col<Machine>,
    stateHandler: StateHandler,
    bookings: Col<Booking>,
    user: User
  }
  ds = new ViewPager.DataSource({pageHasChanged: (r1, r2) => r1.isSame(r2, 'd')})
  state: TimetableState
  viewPager: ViewPager
  scrollView: ScrollView
  scrolled: boolean

  constructor (props) {
    super(props)
    const now = moment.tz(props.laundry.timezone).startOf('day')
    this.state = {
      showModal: false,
      showPicker: false,
      refreshing: false,
      maxPage: 1,
      page: 0,
      now,
      offset: this.calculateTimesOffset(props),
      end: this.calculateTimesEnd(props),
      data: this.ds.cloneWithPages(this.generateDays(now)),
      deleted: {}
    }
  }

  generateDays (now: moment, date: ?moment) {
    const diff = (date || this.props.date).clone().add(1, 'h').diff(now, 'd')
    return range(0, diff + 3).map(i => now.clone().add(i, 'd'))
  }

  renderHeader () {
    return <View style={[timetable.headerRow]}>
      {this.props.laundry.machines.map(id => (
        <View style={[timetable.headerCell]} key={id}>
          <Text
            style={timetable.headerText} numberOfLines={1}
            ellipsizeMode={Platform.OS === 'ios' ? 'clip' : 'tail'}>
            {(this.props.machines[id] && this.props.machines[id].name) || ''}
          </Text>
        </View>
      ))}
    </View>
  }

  componentWillReceiveProps (props) {
    const {date, laundry} = props
    if (laundry !== this.props.laundry) {
      this.setState({
        offset: this.calculateTimesOffset(props),
        end: this.calculateTimesEnd(props)
      })
    }
    if (date.isSame(this.props.date, 'd')) {
      return
    }
    this
      .setState({data: this.ds.cloneWithPages(this.generateDays(this.state.now, date))},
        () => {
          if (!this.viewPager) {
            return
          }
          const shouldViewPage = this.props.date.clone().add(1, 'h').diff(this.state.now, 'd')
          if (this.viewPager.getCurrentPage() === shouldViewPage) {
            return
          }
          setTimeout(() => this.viewPager.goToPage(shouldViewPage, false), 0)
        })
  }

  scrollTo (layout) {
    if (!this.scrollView || this.scrolled) {
      return
    }
    this.scrolled = true
    this.scrollView.scrollTo({y: this.calculateScrollTo(layout.height), animated: false})
  }

  calculateScrollTo (height) {
    const now = moment.tz(this.props.laundry.timezone)
    const scrollTo = ((now.hours() * 2 + now.minutes() / 30) - this.state.offset - 1) * 50
    const min = 0
    const max = (this.state.end - this.state.offset) * 50 - height
    return Math.min(Math.max(min, scrollTo), max)
  }

  async refresh () {
    this.setState({refreshing: true})
    await this.props.onRefresh()
    this.setState({refreshing: false})
  }

  render () {
    return <View style={timetable.container}>
      {this.renderPicker()}
      {this.renderTitle()}
      {this.renderHeader()}
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()}/>}
        ref={r => (this.scrollView = r)} onLayout={evt => this.scrollTo(evt.nativeEvent.layout)}>
        <ViewPager
          ref={r => (this.viewPager = r)}
          onChangePage={pageNum => {
            console.log('Change page to', pageNum)
            this.props.onChangeDate(this.state.data.getPageData(pageNum))
          }}
          renderPageIndicator={false}
          style={{flex: 1}}
          dataSource={this.state.data}
          renderPage={d => (
            <View style={{flex: 1}}>
              {this.renderTable(d)}
            </View>
          )}
        />
      </ScrollView>
      <Confirm
        onConfirm={this.state.onConfirm || (() => {})}
        onCancel={() => this.setState({showModal: false})}
        visible={this.state.showModal}
        id='general.confirm.delete'/>
    </View>
  }

  renderPicker () {
    if (!this.state.showPicker) {
      return null
    }
    return <DatePicker
      timezone={this.props.laundry.timezone}
      date={this.props.date}
      onCancel={() => this.setState({showPicker: false})}
      onChange={date => {
        this.setState({showPicker: false})
        this.props.onChangeDate(date)
      }}/>
  }

  renderTitle (d: ?moment) {
    d = d || this.props.date
    const backDisabled = d.isSame(moment(), 'd')
    return <View style={timetable.titleContainer}>
      <View style={timetable.dateView}>
        <TouchableOpacity
          disabled={backDisabled}
          style={timetable.dateNavigator}
          onPress={(event) => this.onPressLeft(event)}>
          <Image
            style={[timetable.arrowHeader, backDisabled ? timetable.arrowHeaderDisabled : null]}
            source={require('../../../img/back_240_dark.png')}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setState({showPicker: true})} style={timetable.dateHeaderTouch}>
          <Image
            style={timetable.dateHeaderImage}
            source={require('../../../img/calendar_240.png')}/>

          <Text style={timetable.dateHeader}>
            {d.isSame(moment(), 'd') ? <FormattedMessage id='timetable.today'/>
              : d.isSame(moment().add(1, 'day'), 'd') ? <FormattedMessage id='timetable.tomorrow'/>
                : <Text>
                    <FormattedDate value={d} weekday='long'/>
                  <Text>{' '}</Text>
                    <FormattedDate value={d} month='numeric' day='numeric'/>
                </Text>}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={timetable.dateNavigator}
          onPress={(event) => this.onPressRight(event)}>
          <Image style={timetable.arrowHeader} source={require('../../../img/forward_240.png')}/>
        </TouchableOpacity>
      </View>
    </View>
  }

  onPressLeft () {
    const newDate = this.props.date.clone().subtract(1, 'day')
    this.props.onChangeDate(newDate)
  }

  onPressRight () {
    const newDate = this.props.date.clone().add(1, 'day')
    this.props.onChangeDate(newDate)
  }

  renderTable (d: moment) {
    return <Table
      deleted={this.state.deleted}
      stateHandler={this.props.stateHandler}
      currentUser={this.props.user}
      bookings={this.props.bookings}
      laundry={this.props.laundry}
      machines={this.props.machines}
      date={d}
      offset={this.state.offset}
      end={this.state.end}
      onDelete={(booking: string) => this.confirmDeleteBooking(booking)}
    />
  }

  confirmDeleteBooking (bookingId: string) {
    this.setState({
      showModal: true,
      onConfirm: () => {
        this.setState({showModal: false})
        this.deleteBooking(bookingId)
      }
    })
  }

  async deleteBooking (bookingId: string) {
    console.log('Deleting booking: ' + bookingId)
    this.setState(({deleted}) => {
      deleted[bookingId] = true
      return {deleted}
    })
    try {
      await this.props.stateHandler.sdk
        .booking(bookingId)
        .del()
    } catch (_) {
      this.setState(({deleted}) => {
        deleted[bookingId] = false
        return {deleted}
      })
    }
  }

  calculateTimesOffset (props) {
    props = props || this.props
    if (!props.laundry.rules.timeLimit) {
      return 0
    }
    const {hour: fromHour, minute: fromMinute} = props.laundry.rules.timeLimit.from
    return Math.floor(fromHour * 2 + fromMinute / 30)
  }

  calculateTimesEnd (props) {
    props = props || this.props
    if (!props.laundry.rules.timeLimit) {
      return 48
    }
    const {hour: toHour, minute: toMinute} = props.laundry.rules.timeLimit.to
    return Math.floor(toHour * 2 + toMinute / 30)
  }

}

type TimetableWrapperProps = {
  laundry: Laundry,
  stateHandler: StateHandler,
  machines: Col<Machine>,
  user: User,
  onInitialLoad: () => void,
  bookings: Col<Booking>
}

export default class TimetableWrapper extends React.Component {
  props: TimetableWrapperProps
  state = {
    loaded: false,
    date: moment.tz(this.props.laundry.timezone).startOf('day')
  }
  loader = () => this.load()

  componentDidMount () {
    this.load()
    this.props.stateHandler.on('reconnected', this.loader)
  }

  componentWillUnmount () {
    this.props.stateHandler.removeListener('reconnected', this.loader)
  }

  isLaundryOwner () {
    return this.props.laundry.owners.indexOf(this.props.user.id) >= 0
  }

  fetchData (): Promise<*> {
    // Retrieve bookings

    const yesterday = this.state.date.clone().subtract(1, 'day')
    const tomorrow = this.state.date.clone().add(2, 'day')
    return this.props.stateHandler.sdk.listBookingsInTime(this.props.laundry.id, {
      year: yesterday.year(),
      month: yesterday.month(),
      day: yesterday.date()
    }, {
      year: tomorrow.year(),
      month: tomorrow.month(),
      day: tomorrow.date()
    })
  }

  render () {
    if (!this.props.laundry.machines.length) {
      return this.renderEmpty()
    }
    return this.renderTables()
  }

  async load () {
    console.log('Loading...')
    await this.props.stateHandler.sdk.listMachines(this.props.laundry.id)
    await this.fetchData()
    console.log('... Loaded')
    this.setState({loaded: true})
  }

  renderTables () {
    return <View style={timetable.container}>
      {this.state.loaded
        ? <Timetable
          onRefresh={() => this.fetchData()}
          date={this.state.date.clone()}
          onChangeDate={newDate => this.onChangeDate(newDate)}
          user={this.props.user}
          laundry={this.props.laundry}
          machines={this.props.machines}
          bookings={this.props.bookings}
          stateHandler={this.props.stateHandler}/>
        : <ActivityIndicator color={constants.darkTheme} size={'large'} style={loader.activityIndicator}/>}
    </View>
  }

  onChangeDate (newDate: moment) {
    this.setState({
      date: newDate
    }, () => {
      InteractionManager.runAfterInteractions(() => this.fetchData())
    })
  }

  renderEmpty () {
    return <View style={timetable.container}>
      <Text>
        <FormattedMessage id='timetable.nomachines'/>
      </Text>
      {this.isLaundryOwner() ? <Text>
        <FormattedMessage id='timetable.nomachines.owner'/>
      </Text> : <Text>
          <FormattedMessage id='timetable.nomachines.notowner'/>
      </Text>}
    </View>
  }

}
