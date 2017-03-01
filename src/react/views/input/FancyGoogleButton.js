/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import FancyImageTextButton from './FancyImageTextButton'
import { fancyGoogleButton } from '../../../style'

const FancyGoogleButton = ({text, onPress, disabled}) => <FancyImageTextButton
  text={text}
  style={fancyGoogleButton.button}
  onPress={onPress}
  disabled={disabled}
  imageSource={require('../../../../img/google.png')}/>

export default FancyGoogleButton

FancyGoogleButton.propTypes = {
  text: FancyImageTextButton.propTypes.text,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

