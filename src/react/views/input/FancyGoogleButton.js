/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import FancyImageButton from './FancyImageButton'
import { fancyGoogleButton } from '../../../style'

const FancyGoogleButton = ({onPress, disabled}) => <FancyImageButton
  style={fancyGoogleButton.button}
  onPress={onPress}
  disabled={disabled}
  imageSource={require('../../../../img/google.png')}/>

export default FancyGoogleButton

FancyGoogleButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

