/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import AuthWebView from './AuthWebView'
import config from '../../config'

const GoogleAuthWebView = ({onCancel, onAuthFailed, onSuccess}) => <AuthWebView
  onSuccess={onSuccess}
  onAuthFailed={onAuthFailed} onCancel={onCancel}
  source={{uri: `${config.laundree.host}/auth/google?mode=native-app`}}/>

GoogleAuthWebView.propTypes = {
  onCancel: AuthWebView.propTypes.onCancel,
  onSuccess: AuthWebView.propTypes.onSuccess,
  onAuthFailed: AuthWebView.propTypes.onAuthFailed
}

export default GoogleAuthWebView
