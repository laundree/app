/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import FancyImageButton from './FancyImageButton'
import { fancyFacebookButton } from '../../../style'

const FancyFacebookButton = ({onPress, disabled}) => <FancyImageButton
  style={fancyFacebookButton.button}
  onPress={onPress}
  disabled={disabled}
  imageSource={require('../../../../img/facebook.png')}/>

export default FancyFacebookButton

FancyFacebookButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

