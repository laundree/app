/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  Text,
  TouchableOpacity,
  ListView,
  View,
  Dimensions,
  ScrollView
} from 'react-native'
import moment from 'moment-timezone'
import Table from './Table'
import { timetable } from '../../style'
import DatePicker from './DatePicker'
import { range } from '../../utils/array'

class Timetable extends React.Component {

  constructor (props) {
    super(props)
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.isSame(r2, 'd')})

    this.state = {
      showPicker: false,
      maxPage: 1,
      page: 0,
      now: moment.tz(props.laundry.timezone)
    }
    this.state.data = this.ds.cloneWithRows(this.generateDays(1))
  }

  generateDays (num) {
    return range(0, num + 1).map(i => this.state.now.clone().add(i, 'd'))
  }

  handleScroll (pageNum) {
    console.log(pageNum)
    this.setState(({page, maxPage}) => {
      if (pageNum === page) return {}
      if (pageNum < maxPage) return {page: pageNum}
      return {page: pageNum, maxPage: pageNum + 1, data: this.ds.cloneWithRows(this.generateDays(pageNum + 1))}
    })
  }

  render () {
    return <View style={timetable.container}>
      {this.renderPicker()}
      <ScrollView>
        <ListView
          onScroll={evt => this.handleScroll(Math.round(evt.nativeEvent.contentOffset.x / Dimensions.get('window').width))}
          style={{flex: 1}}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled
          dataSource={this.state.data}
          renderRow={d => (
            <View style={{width: Dimensions.get('window').width, flex: 1}}>
              {this.renderTable(d)}
            </View>
          )}
        />
      </ScrollView>
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

  renderTitle (d) {
    const rightArrow = d.isSame(moment(), 'd')
      ? <Text style={timetable.dateNavigator}/>
      : <TouchableOpacity
        style={timetable.dateNavigator}
        onPress={(event) => this.onPressLeft(event)}>
        <Text style={timetable.arrowHeader}>{'<'}</Text>
      </TouchableOpacity>

    return <View style={timetable.titleContainer}>
      <View style={timetable.dateView}>
        {rightArrow}
        <TouchableOpacity onPress={() => this.setState({showPicker: true})}>
          <Text style={timetable.dateHeader}>
            {d.isSame(moment(), 'd') ? 'Today'
              : d.isSame(moment().add(1, 'day'), 'd') ? 'Tomorrow'
                : d.format('dddd D[/]M')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={timetable.dateNavigator}
          onPress={(event) => this.onPressRight(event)}>
          <Text style={timetable.arrowHeader}>{'>'}</Text>
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
    />
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

