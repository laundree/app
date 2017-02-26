/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import AuthWebView from './AuthWebView'
import config from '../../config'

const FacebookAuthWebView = ({onCancel, onAuthFailed, onSuccess}) => <AuthWebView
  onAuthFailed={onAuthFailed} onCancel={onCancel} onSuccess={onSuccess}
  source={{uri: `${config.laundree.host}/auth/facebook?mode=native-app`}}/>

FacebookAuthWebView.propTypes = {
  onCancel: AuthWebView.propTypes.onCancel,
  onSuccess: AuthWebView.propTypes.onSuccess,
  onAuthFailed: AuthWebView.propTypes.onAuthFailed
}

export default FacebookAuthWebView
