// @flow

import React from 'react'
import {
  View
} from 'react-native'
import Camera from 'react-native-camera'
import url from 'url'
import { qrCodeScannerCamera } from '../style'
import type { StateHandler } from '../stateHandler'

export default class QrCodeScanner extends React.PureComponent<{ stateHandler: StateHandler }> {
  _working = false

  async handleData (qrData: string) {
    if (this._working) return
    const {path} = url.parse(qrData)
    const pathPattern = /^\/s\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)$/
    const matches = path && path.match(pathPattern)
    const laundryid = matches && matches[1]
    const code = laundryid && matches[2]
    if (!laundryid || !code) return
    this._working = true
    return this.props.stateHandler.sdk.api.laundry.addFromCode(laundryid, code)
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

