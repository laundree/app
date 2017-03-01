/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { Text } from 'react-native'
import FancyButton from './FancyButton'
import { fancyTextButton } from '../../../style'

const FancyTextButton = ({text, onPress, disabled, style}) => <FancyButton
  style={style} onPress={onPress}
  disabled={disabled}>
  <Text style={[fancyTextButton.text, disabled ? fancyTextButton.disabled : fancyTextButton.enabled]}>{text}</Text>
</FancyButton>

export default FancyTextButton

FancyTextButton.propTypes = {
  style: FancyButton.propTypes.style,
  text: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

