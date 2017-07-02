// @flow
import React from 'react'
import AuthWebView from './AuthWebView'
import config from '../../config'
type Props = { onAuthFailed: () => void, onSuccess: () => void }
const FacebookAuthWebView = ({onAuthFailed, onSuccess}: Props) => <AuthWebView
  onAuthFailed={onAuthFailed} onSuccess={onSuccess}
  source={{uri: `${config.laundree.host}/auth/facebook?mode=native-app-v2`}} />

export default FacebookAuthWebView
