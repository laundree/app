/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { Text } from 'react-native'
import FancyButton from './FancyButton'
import { fancyTextButton } from '../../../style'
import { FormattedMessage } from 'react-intl'

const FancyTextButton = ({id, onPress, disabled, style}) => <FancyButton
  style={style} onPress={onPress}
  disabled={disabled}>
  <Text style={[fancyTextButton.text, disabled ? fancyTextButton.disabled : fancyTextButton.enabled]}>
    <FormattedMessage id={id}/>
  </Text>
</FancyButton>

export default FancyTextButton

FancyTextButton.propTypes = {
  style: FancyButton.propTypes.style,
  id: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

