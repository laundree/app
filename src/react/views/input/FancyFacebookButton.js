/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { StyleSheet } from 'react-native'
import FancyImageTextButton from './FancyImageTextButton'

const FancyGoogleButton = ({text, onPress, disabled}) => <FancyImageTextButton
  text={text}
  style={styleSheet.button}
  onPress={onPress}
  disabled={disabled}
  imageSource={require('../../../../img/facebook.png')}/>

export default FancyGoogleButton

const styleSheet = StyleSheet.create({
  button: {
    backgroundColor: '#0F6084'
  }
})

FancyGoogleButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

