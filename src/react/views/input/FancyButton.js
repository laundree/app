/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { TouchableHighlight, View } from 'react-native'
import { fancyButton } from '../../../style'

const FancyButton = ({children, onPress, disabled, style}) => <TouchableHighlight disabled={disabled} onPress={onPress}>
  <View style={[fancyButton.button, disabled ? fancyButton.disabled : fancyButton.enabled, style]}>
    {children}
  </View>
</TouchableHighlight>

export default FancyButton

FancyButton.propTypes = {
  children: React.PropTypes.any.isRequired,
  onPress: TouchableHighlight.propTypes.onPress,
  style: View.propTypes.style,
  disabled: React.PropTypes.bool
}
