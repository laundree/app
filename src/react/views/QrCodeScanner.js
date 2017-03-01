/**
 * Created by soeholm on 05.02.17.
 */
'use strict'
import React, { Component } from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { qrCodeScanner } from '../../style'

export default class QrCodeScanner extends Component {

  render () {
    return (
      <View style={qrCodeScanner.container}>
        <Text style={qrCodeScanner.message}>
          Press the button to start scanning the QR code for the laundry
        </Text>
        <TouchableOpacity onPress={this.props.onShowScanner} style={qrCodeScanner.image} >
          <Image source={require('../../../img/qrcode_240.png')} resizeMode='contain' style={{flex: 1}}/>
        </TouchableOpacity>
        <Text style={qrCodeScanner.message}>
          Or ask the admin to add your {'\n'}
          e-mail address
        </Text>
        <Text style={qrCodeScanner.message}>
          Happy washing!
        </Text>
      </View>
    )
  }
}
QrCodeScanner.propTypes = {
  onShowScanner: TouchableOpacity.propTypes.onPress
}
