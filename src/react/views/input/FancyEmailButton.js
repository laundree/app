/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import FancyImageTextButton from './FancyImageTextButton'

const FancyEmailButton = ({id, onPress, disabled}) => <FancyImageTextButton
  style={FancyEmailButton.button}
  onPress={onPress}
  id={id}
  disabled={disabled}
  imageSource={require('../../../../img/email.png')}/>

export default FancyEmailButton

FancyEmailButton.propTypes = {
  id: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

