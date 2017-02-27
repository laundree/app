/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import FancyImageTextButton from './FancyImageTextButton'
import { fancyFacebookButton } from '../../../style'

const FancyFacebookButton = ({text, onPress, disabled}) => <FancyImageTextButton
  text={text}
  style={fancyFacebookButton.button}
  onPress={onPress}
  disabled={disabled}
  imageSource={require('../../../../img/facebook.png')}/>

export default FancyFacebookButton

FancyFacebookButton.propTypes = {
  text: FancyImageTextButton.propTypes.text,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

