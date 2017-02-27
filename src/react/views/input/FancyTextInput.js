/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { View, TextInput, Text, StyleSheet } from 'react-native'
import constants from '../../../constants'

const FancyTextInput = ({label, value, onChangeText, keyboardType, secureTextEntry}) => <View style={styles.container}>
  <Text style={styles.label}>
    {label}
  </Text>
  <TextInput
    style={styles.textInput}
    keyboardType={keyboardType}
    onChangeText={onChangeText}
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
const styles = StyleSheet.create({
  label: {
    height: 20,
    color: constants.defaultTextColor
  },
  textInput: {
    height: 40,
    borderRadius: 3,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: '#fff'
  },
  container: {
    alignSelf: 'stretch'
  }
})

export default FancyTextInput
