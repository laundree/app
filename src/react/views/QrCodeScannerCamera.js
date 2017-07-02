/**
 * Created by soeholm on 05.02.17.
 */
'use strict'
import React, { Component } from 'react'
import {
  View
} from 'react-native'
import Camera from 'react-native-camera'
import url from 'url'
import { qrCodeScannerCamera } from '../../style'
export default class QrCodeScanner extends Component {
  handleData (qrData) {
    if (this._working) return
    const {path} = url.parse(qrData)
    const pathPattern = /^\/s\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/
    const matches = path && path.match(pathPattern)
    const laundryid = matches && matches[1]
    const code = laundryid && matches[2]
    if (!laundryid || !code) return
    this._working = true
    this.props.stateHandler.sdk.laundry(laundryid).addFromCode(code)
  }

  render () {
    return (
      <View style={qrCodeScannerCamera.container}>
        <Camera
          onBarCodeRead={event => this.handleData(event.data)}
          style={qrCodeScannerCamera.camera}
          aspect={Camera.constants.Aspect.fill}
        />
      </View>
    )
  }
}
QrCodeScanner.propTypes = {
  stateHandler: React.PropTypes.object.isRequired
}
