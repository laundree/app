// @flow
import React from 'react'
import AuthWebView from './AuthWebView'
import config from '../../config'
type Props = { onAuthFailed: () => void, onSuccess: () => void }

const GoogleAuthWebView = ({onAuthFailed, onSuccess}: Props) => <AuthWebView
  onSuccess={onSuccess}
  onAuthFailed={onAuthFailed}
  source={{uri: `${config.laundree.host}/auth/google?mode=native-app`}}/>

export default GoogleAuthWebView
