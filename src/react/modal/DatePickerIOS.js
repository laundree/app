// @flow
import React from 'react'
import FancyTextButton from '../input/FancyTextButton'
import { modal } from '../../style'
import {
  DatePickerIOS,
  View
} from 'react-native'
import Base from './Base'

type PickerProps = {
  onChange: Function,
  onCancel: Function,
  date: Date
}

class Picker extends React.PureComponent<PickerProps, { date: Date }> {
  constructor (props: PickerProps) {
    super(props)
    this.state = {
      date: props.date
    }
  }

  render () {
    return <Base visible onRequestClose={this.props.onCancel}>
      <DatePickerIOS
        minimumDate={new Date()}
        mode='date' date={this.state.date} onDateChange={date => this.setState({date})} />
      <View style={modal.button}>
        <FancyTextButton
          disabled={new Date(this.state.date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)}
          id='timetable.today' onPress={() => this.setState({date: new Date()})} />
      </View>

      <View style={modal.buttonContainer}>
        <View style={modal.button}>
          <FancyTextButton
            id='timetable.select' onPress={() => this.props.onChange(this.state.date)} />
        </View>
        <View style={modal.button}>
          <FancyTextButton
            style={modal.redButton} id='general.cancel' onPress={this.props.onCancel} />
        </View>
      </View>
    </Base>
  }
}

export default Picker
