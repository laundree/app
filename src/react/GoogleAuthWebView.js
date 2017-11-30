// @flow
import React from 'react'
import AuthWebView from './AuthWebView'
import config from '../config'
type Props = { onAuthFailed: () => void, onSuccess: () => void }

const GoogleAuthWebView = ({onAuthFailed, onSuccess}: Props) => <AuthWebView
  onSuccess={onSuccess}
  onAuthFailed={onAuthFailed}
  fakeUserAgent
  source={{uri: `${config.laundree.host}/auth/google?mode=native-app-v2`}} />

export default GoogleAuthWebView
