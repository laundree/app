/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { TouchableHighlight, StyleSheet, View } from 'react-native'

const FancyButton = ({children, onPress, disabled, style}) => <TouchableHighlight disabled={disabled} onPress={onPress}>
  <View style={[styleSheet.button, disabled ? styleSheet.disabled : styleSheet.enabled, style]}>
    {children}
  </View>
</TouchableHighlight>

export default FancyButton

const styleSheet = StyleSheet.create({
  button: {
    borderRadius: 3,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40
  },
  enabled: {
    backgroundColor: '#28aaba'
  },
  disabled: {
    backgroundColor: '#d1d1d1'
  }
})

FancyButton.propTypes = {
  children: React.PropTypes.any.isRequired,
  onPress: TouchableHighlight.propTypes.onPress,
  style: View.propTypes.style,
  disabled: React.PropTypes.bool
}

