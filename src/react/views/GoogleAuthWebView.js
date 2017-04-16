/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import AuthWebView from './AuthWebView'
import config from '../../config'

const GoogleAuthWebView = ({onAuthFailed, onSuccess}) => <AuthWebView
  onSuccess={onSuccess}
  onAuthFailed={onAuthFailed}
  source={{uri: `${config.laundree.host}/auth/google?mode=native-app`}}/>

GoogleAuthWebView.propTypes = {
  onSuccess: AuthWebView.propTypes.onSuccess,
  onAuthFailed: AuthWebView.propTypes.onAuthFailed
}

export default GoogleAuthWebView
