/**
 * Created by budde on 26/03/2017.
 */
import React from 'react'
import FancyTextButton from './../input/FancyTextButton'
import { modal } from '../../../style'
import {
  DatePickerIOS,
  View
} from 'react-native'
import Base from './Base'

class Picker extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      date: props.date
    }
  }

  render () {
    return <Base visible onRequestClose={this.props.onCancel}>
      <DatePickerIOS
        minimumDate={new Date()}
        mode='date' date={this.state.date} onDateChange={date => this.setState({date})}/>
      <View style={modal.button}>
        <FancyTextButton
          disabled={new Date(this.state.date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)}
          text='Today' onPress={() => this.setState({date: new Date()})}/>
      </View>

      <View style={modal.buttonContainer}>
        <View style={modal.button}>
          <FancyTextButton
            text='Select' onPress={() => this.props.onChange(this.state.date)}/>
        </View>
        <View style={modal.button}>
          <FancyTextButton
            style={modal.redButton} text='Cancel' onPress={this.props.onCancel}/>
        </View>
      </View>
    </Base>
  }
}

Picker.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  date: React.PropTypes.object.isRequired
}

export default Picker
