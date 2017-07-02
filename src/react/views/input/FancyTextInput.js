// @flow

import React from 'react'
import { View, TextInput } from 'react-native'
import { fancyTextInput, constants } from '../../../style'

type Props = {
  secureTextEntry?: boolean,
  label?: string,
  keyboardType?: 'default' |
    'email-address' |
    'numeric' |
    'phone-pad' |
    'ascii-capable' |
    'numbers-and-punctuation' |
    'url' |
    'number-pad' |
    'name-phone-pad' |
    'decimal-pad' |
    'twitter' |
    'web-search',
  onChangeText: Function,
  value: string
}

const FancyTextInput = ({label, value, onChangeText, keyboardType, secureTextEntry}: Props) => <View
  style={fancyTextInput.container}>
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

export default FancyTextInput
