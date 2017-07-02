/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import FancyImageTextButton from './FancyImageTextButton'
import { fancyGoogleButton } from '../../../style'

const FancyGoogleButton = ({id, onPress, disabled}) => <FancyImageTextButton
  style={fancyGoogleButton.button}
  onPress={onPress}
  disabled={disabled}
  id={id}
  imageSource={require('../../../../img/google.png')} />

export default FancyGoogleButton

FancyGoogleButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  id: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool
}

