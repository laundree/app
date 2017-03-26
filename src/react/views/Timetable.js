/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import moment from 'moment-timezone'
import Table from './Table'
import { timetable } from '../../style'
import DatePicker from './DatePicker'

class Timetable extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      showPicker: false
    }
  }

  render () {
    return <View style={timetable.container}>
      {this.renderPicker()}
      {this.renderTitle()}
      {this.renderTable()}
    </View>
  }

  renderPicker () {
    if (!this.state.showPicker) {
      return null
    }
    return <DatePicker
      date={this.props.date.toDate()}
      onCancel={() => this.setState({showPicker: false})}
      onChange={date => {
        this.setState({showPicker: false})
        this.props.onChangeDate(moment.tz(date, this.props.laundry.timezone))
      }}/>
  }

  renderTitle () {
    const rightArrow = this.props.date.isSame(moment(), 'd')
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
            {this.props.date.isSame(moment(), 'd') ? 'Today'
              : this.props.date.isSame(moment().add(1, 'day'), 'd') ? 'Tomorrow'
                : this.props.date.format('dddd D[/]M')}
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

  renderTable () {
    return <Table
      stateHandler={this.props.stateHandler}
      currentUser={this.props.user}
      bookings={this.props.bookings}
      laundry={this.props.laundry}
      machines={this.props.machines}
      date={this.props.date}
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
    this.fetchData()
  }

  fetchData () {
    // Retrieve machines
    this.props.stateHandler.sdk.listMachines(this.laundryId)

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
    }, this.fetchData)
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

