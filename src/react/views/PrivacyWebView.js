/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import {
  WebView
} from 'react-native'
import config from '../../config'

const PrivacyWebView = () => <WebView source={{uri: `${config.laundree.host}/privacy`}}/>

export default PrivacyWebView
