/**
 * Created by budde on 26/03/2017.
 */
import React from 'react'
import DatePickerIOS from './modal/DatePickerIOS'
import { Platform } from 'react-native'
const DatePicker = ({onCancel, onChange, date}) => (
  Platform.OS === 'ios'
    ? <DatePickerIOS onCancel={onCancel} onChange={onChange} date={date}/>
    : null
)

DatePicker.propTypes = {
  onCancel: React.PropTypes.func.isRequired,
  onChange: React.PropTypes.func.isRequired,
  date: React.PropTypes.object.isRequired
}

export default DatePicker
