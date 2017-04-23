// @flow
import React from 'react'
import LoadingWebView from './LoadingWebView'
import type { WebView } from 'react-native'
import config from '../../config'
import { authWebView } from '../../style'
import url from 'url'

class AuthWebView extends React.Component {
  state: { onMessage: ?() => void } = {onMessage: null}
  props: {
    source: {
      uri: string
    },
    onSuccess: () => void,
    onAuthFailed: () => void
  }
  interval: number
  _messageHandled: boolean
  ref: WebView

  isBack (u: string) {
    const backUrl = `${config.laundree.host}/native-app`
    const {host, auth, protocol, path} = url.parse(backUrl)
    const {host: host2, auth: auth2, protocol: protocol2, path: path2} = url.parse(u)
    return auth === auth2 && protocol === protocol2 && path === path2 && host === host2
  }

  onLoadUrl (url: string) {
    if (!this.isBack(url)) return
    this.startSendTokenRequest()
  }

  injectedJavaScript = `(function() {
  var originalPostMessage = window.postMessage;
  var patchedPostMessage = function(message, targetOrigin, transfer) { 
    originalPostMessage(message, targetOrigin, transfer);
  };
  patchedPostMessage.toString = function() { 
    return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage'); 
  };  
  window.postMessage = patchedPostMessage;
})();`

  handleMessage (message: string) {
    console.log('Handling message', message)
    if (this._messageHandled) return
    console.log('Handling message', message)
    this._messageHandled = true
    this.stopSendTokenRequest()
    try {
      const {secret, userId} = JSON.parse(message)
      if (!(secret && userId)) {
        console.log('No token provided. Auth failed.')
        return this.props.onAuthFailed()
      }
      this.props.onSuccess({secret, userId})
    } catch (error) {
      console.log(error)
    }
  }

  startSendTokenRequest () {
    console.log('Starting send token request')
    this.sendTokenRequest()
    this.interval = setInterval(() => this.sendTokenRequest(), 100)
  }

  stopSendTokenRequest () {
    if (!this.interval) return
    clearInterval(this.interval)
  }

  componentWillUnmount () {
    this.stopSendTokenRequest()
  }

  sendTokenRequest () {
    if (!this.ref) return
    console.log('Sending token request')
    this.ref.postMessage('token')
  }

  render () {
    return <LoadingWebView
      viewStyle={authWebView.view}
      injectedJavaScript={this.injectedJavaScript}
      webViewRef={ref => { this.ref = ref }}
      onMessage={evt => this.handleMessage(evt.nativeEvent.data)}
      source={this.props.source}
      style={authWebView.webView}
      onLoadStart={evt => this.onLoadUrl(evt.nativeEvent.url)}/>
  }
}

export default AuthWebView
