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
  imageSource={require('../../../../img/google.png')}/>

export default FancyGoogleButton

const styleSheet = StyleSheet.create({
  button: {
    backgroundColor: '#7D1919'
  }
})

FancyGoogleButton.propTypes = {
  text: FancyImageTextButton.propTypes.text,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

