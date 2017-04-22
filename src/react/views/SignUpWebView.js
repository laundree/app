/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import {
  WebView
} from 'react-native'
import config from '../../config'

const SignUpWebView = () => <WebView source={{uri: `${config.laundree.host}/auth/sign-up`}}/>

export default SignUpWebView
