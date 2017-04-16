/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Platform
} from 'react-native'
import moment from 'moment-timezone'
import Table from './Table'
import { timetable } from '../../style'
import DatePicker from './DatePicker'
import { range } from '../../utils/array'
import ViewPager from 'react-native-viewpager'
import Confirm from './modal/Confirm'

class Timetable extends React.Component {

  constructor (props) {
    super(props)
    this.ds = new ViewPager.DataSource({pageHasChanged: (r1, r2) => r1.isSame(r2, 'd')})

    this.state = {
      showModal: false,
      showPicker: false,
      maxPage: 1,
      page: 0,
      now: moment.tz(props.laundry.timezone).startOf('day'),
      offset: this.calculateTimesOffset(props),
      end: this.calculateTimesEnd(props)
    }
    this.state.data = this.ds.cloneWithPages(this.generateDays())
  }

  generateDays (date = this.props.date) {
    const diff = date.clone().add(1, 'h').diff(this.state.now, 'd')
    return range(0, diff + 3).map(i => this.state.now.clone().add(i, 'd'))
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
      .setState({data: this.ds.cloneWithPages(this.generateDays(date))},
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

  render () {
    return <View style={timetable.container}>
      {this.renderPicker()}
      {this.renderTitle()}
      {this.renderHeader()}
      <ScrollView ref={r => (this.scrollView = r)} onLayout={evt => this.scrollTo(evt.nativeEvent.layout)}>
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
        text='Are you sure that you want to delete this booking?'/>
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

  renderTitle (d = this.props.date) {
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
            {d.isSame(moment(), 'd') ? 'Today'
              : d.isSame(moment().add(1, 'day'), 'd') ? 'Tomorrow'
                : d.format('dddd D[/]M')}
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

  renderTable (d) {
    return <Table
      stateHandler={this.props.stateHandler}
      currentUser={this.props.user}
      bookings={this.props.bookings}
      laundry={this.props.laundry}
      machines={this.props.machines}
      date={d}
      offset={this.state.offset}
      end={this.state.end}
      onDelete={booking => this.confirmDeleteBooking(booking)}
    />
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

  calculateTimesOffset (props = this.props) {
    if (!props.laundry.rules.timeLimit) return 0
    const {hour: fromHour, minute: fromMinute} = props.laundry.rules.timeLimit.from
    return Math.floor(fromHour * 2 + fromMinute / 30)
  }

  calculateTimesEnd (props = this.props) {
    if (!props.laundry.rules.timeLimit) return 48
    const {hour: toHour, minute: toMinute} = props.laundry.rules.timeLimit.to
    return Math.floor(toHour * 2 + toMinute / 30)
  }

}

Timetable.propTypes = {
  date: React.PropTypes.object.isRequired,
  onChangeDate: React.PropTypes.func.isRequired,
  laundry: React.PropTypes.object.isRequired,
  machines: React.PropTypes.object.isRequired,
  stateHandler: React.PropTypes.object.isRequired,
  bookings: React.PropTypes.object,
  user: React.PropTypes.object.isRequired
}

export default class TimetableWrapper extends React.Component {

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
    let tomorrow = this.state.date.clone().add(1, 'day')

    this.props.stateHandler.sdk.listBookingsInTime(this.laundryId, {
      year: this.state.date.year(),
      month: this.state.date.month(),
      day: this.state.date.date()
    }, {
      year: tomorrow.year(),
      month: tomorrow.month(),
      day: tomorrow.date()
    })
  }

  get laundryId () {
    return this.props.laundry.id
  }

  render () {
    if (!this.props.machines) {
      return this.renderEmpty()
    }
    return this.renderTables()
  }

  renderTables () {
    return <View style={timetable.container}>
      <Timetable
        date={this.state.date.clone()}
        onChangeDate={newDate => this.onChangeDate(newDate)}
        user={this.props.user}
        laundry={this.props.laundry}
        machines={this.props.machines}
        bookings={this.props.bookings}
        stateHandler={this.props.stateHandler}/>
    </View>
  }

  onChangeDate (newDate) {
    this.setState({
      date: newDate
    }, () => this.fetchData())
  }

  renderEmpty () {
    return <View style={timetable.container}>
      <Text>
        There are no machines registered.
      </Text>
      {this.isLaundryOwner ? <Text>
        Go to the website and register machines.
      </Text> : <Text>
        Ask your administrator to register machines.
      </Text>}
    </View>
  }

  get isLaundryOwner () {
    return this.props.laundry.owners.indexOf(this.props.user) >= 0
  }
}

TimetableWrapper.propTypes = {
  user: React.PropTypes.object.isRequired,
  laundry: React.PropTypes.object.isRequired,
  machines: React.PropTypes.object,
  bookings: React.PropTypes.object,
  stateHandler: React.PropTypes.object.isRequired
}

