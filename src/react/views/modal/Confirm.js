/**
 * Created by budde on 26/03/2017.
 */
import React from 'react'
import FancyTextButton from './../input/FancyTextButton'
import { modal } from '../../../style'
import {
  Text,
  View
} from 'react-native'
import Base from './Base'

const Confirm = ({text, visible, onCancel, onConfirm}) => (
  <Base visible={visible} onRequestClose={onCancel}>
    <View style={modal.title}>
      <Text style={modal.titleText}>
        {text}
      </Text>
    </View>
    <View style={modal.buttonContainer}>
      <View style={modal.button}>
        <FancyTextButton
          text='Yes'
          onPress={onConfirm}/>
      </View>
      <View style={modal.button}>
        <FancyTextButton
          style={modal.redButton} text='No' onPress={onCancel}/>
      </View>
    </View>
  </Base>)

Confirm.propTypes = {
  text: React.PropTypes.string.isRequired,
  onConfirm: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  visible: React.PropTypes.bool
}

export default Confirm
