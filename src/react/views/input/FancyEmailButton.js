/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import FancyImageTextButton from './FancyImageTextButton'
import { fancyFacebookButton } from '../../../style'

const FancyEmailButton = ({text, onPress, disabled}) => <FancyImageTextButton
  style={FancyEmailButton.button}
  onPress={onPress}
  text={text}
  disabled={disabled}
  imageSource={require('../../../../img/email.png')}/>

export default FancyEmailButton

FancyEmailButton.propTypes = {
  text: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

