/**
 * Created by budde on 26/03/2017.
 */
import React from 'react'
import DatePickerIOS from './modal/DatePickerIOS'
import {
  Platform,
  DatePickerAndroid
} from 'react-native'
const moment = require('moment-timezone')

class DatePickerAndroidWrapper extends React.Component {
  async componentDidMount () {
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
DatePickerAndroidWrapper.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  timezone: React.PropTypes.string.isRequired,
  date: React.PropTypes.object.isRequired
}

const DatePicker = ({onCancel, onChange, date, timezone}) => {
  if (Platform.OS === 'ios') {
    return <DatePickerIOS
      onCancel={onCancel} onChange={date => onChange(moment.tz(date, timezone))}
      date={date.toDate()}/>
  }
  return <DatePickerAndroidWrapper timezone={timezone} onChange={onChange} onCancel={onCancel} date={date}/>
}

DatePicker.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  date: React.PropTypes.object.isRequired,
  timezone: React.PropTypes.string.isRequired
}

export default DatePicker
