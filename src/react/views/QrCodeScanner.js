/**
 * Created by soeholm on 05.02.17.
 */
'use strict'
import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'

export default class QrCodeScanner extends Component {

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Press the button to start scanning the QR code for the laundry
        </Text>
        <TouchableOpacity onPress={this.props.onShowScanner} style={styles.image} >
          <Image source={require('../../../img/qrcode_240.png')} resizeMode='contain' style={{flex: 1}}/>
        </TouchableOpacity>
        <Text style={styles.message}>
          Or ask the admin to add your {'\n'}
          e-mail address
        </Text>
        <Text style={styles.message}>
          Happy washing!
        </Text>
      </View>
    )
  }
}
QrCodeScanner.propTypes = {
  onShowScanner: TouchableOpacity.propTypes.onPress
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    textAlign: 'center',
    maxWidth: 200,
    paddingBottom: 20,
    paddingTop: 20
  },
  image: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    maxWidth: 200,
    maxHeight: 200
  }
})
