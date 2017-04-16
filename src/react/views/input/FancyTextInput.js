/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { View, TextInput } from 'react-native'
import { fancyTextInput, constants } from '../../../style'

const FancyTextInput = ({label, value, onChangeText, keyboardType, secureTextEntry}) => <View style={fancyTextInput.container}>
  <TextInput
    placeholder={label}
    style={fancyTextInput.textInput}
    keyboardType={keyboardType}
    onChangeText={onChangeText}
    underlineColorAndroid={constants.darkTheme}
    secureTextEntry={secureTextEntry}
    value={value}
  />
</View>

FancyTextInput.propTypes = {
  secureTextEntry: TextInput.propTypes.secureTextEntry,
  label: React.PropTypes.string.isRequired,
  keyboardType: TextInput.propTypes.keyboardType,
  onChangeText: TextInput.propTypes.onChangeText,
  value: TextInput.propTypes.value
}

export default FancyTextInput
