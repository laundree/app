// @flow

import React from 'react'
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'
import { qrCodeScanner } from '../style'
import { FormattedMessage } from 'react-intl'

export default ({onShowScanner}: { onShowScanner: Function }) => (
  <ScrollView>
    <View style={qrCodeScanner.container}>
      <Text style={qrCodeScanner.message}>
        <FormattedMessage id='qrcodescanner.startscan' />
      </Text>
      <TouchableOpacity onPress={onShowScanner} style={qrCodeScanner.image}>
        <Image source={require('../../img/qrcode_240.png')} resizeMode='contain' style={{flex: 1}} />
      </TouchableOpacity>
      <Text style={qrCodeScanner.message}>
        <FormattedMessage id='qrcodescanner.askadmin' />
      </Text>
      <Text style={qrCodeScanner.message}>
        <FormattedMessage id='qrcodescanner.happywashing' />
      </Text>
    </View>
  </ScrollView>
)
