/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { StyleSheet, Text } from 'react-native'
import FancyButton from './FancyButton'

const FancyTextButton = ({text, onPress, disabled, style}) => <FancyButton style={style} onPress={onPress} disabled={disabled}>
  <Text style={[styleSheet.text, disabled ? styleSheet.disabled : styleSheet.enabled]}>{text}</Text>
</FancyButton>

export default FancyTextButton

const styleSheet = StyleSheet.create({
  text: {
    color: '#fff'
  },
  enabled: {
    color: '#fff'
  },
  disabled: {
    color: '#e2e2e2'
  }
})

FancyTextButton.propTypes = {
  style: FancyButton.propTypes.style,
  text: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

