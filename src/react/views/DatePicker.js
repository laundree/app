// @flow

import React from 'react'
import DatePickerIOS from './modal/DatePickerIOS'
import {
  Platform,
  DatePickerAndroid
} from 'react-native'

const moment = require('moment-timezone')
type DatePickerProps = {
  onChange: Function,
  onCancel: Function,
  timezone: string,
  date: moment
}

class DatePickerAndroidWrapper extends React.Component {
  props: DatePickerProps

  componentDidMount () {
    this.aComponentDidMount()
  }

  async aComponentDidMount () {
    const {action, year, month, day} = await DatePickerAndroid.open({
      date: this.props.date.toDate(),
      minDate: new Date()
    })
    if (action === DatePickerAndroid.dismissedAction) {
      return this.props.onCancel()
    }
    return this.props.onChange(moment.tz({year, month, day}, this.props.timezone))
  }

  render () {
    return null
  }
}

const DatePicker = ({onCancel, onChange, date, timezone}: DatePickerProps) => {
  if (Platform.OS === 'ios') {
    return <DatePickerIOS
      onCancel={onCancel} onChange={date => onChange(moment.tz(date, timezone))}
      date={date.toDate()}/>
  }
  return <DatePickerAndroidWrapper timezone={timezone} onChange={onChange} onCancel={onCancel} date={date}/>
}

export default DatePicker
