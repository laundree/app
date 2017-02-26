/**
 * Created by soeholm on 05.02.17.
 */
'use strict'
import React, { Component } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Navigator
} from 'react-native'
import Camera from 'react-native-camera'

export default class QrCodeScanner extends Component {

  render () {
    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          aspect={Camera.constants.Aspect.fill}
        />
      </View>
    )
  }
}
QrCodeScanner.propTypes = {}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  camera: {
    borderWidth: 1
  }
})
