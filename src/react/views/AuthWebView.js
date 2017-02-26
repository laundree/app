/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import {
  WebView,
  View,
  StyleSheet,
  Platform
} from 'react-native'
import FancyTextButton from './input/FancyTextButton'
import constants from '../../constants'
import config from '../../config'
import url from 'url'

class AuthWebView extends React.Component {

  constructor (props) {
    super(props)
    this.state = {onMessage: undefined}
  }

  isBack (u) {
    const backUrl = `${config.laundree.host}/native-app`
    const {host, auth, protocol, path} = url.parse(backUrl)
    const {host: host2, auth: auth2, protocol: protocol2, path: path2} = url.parse(u)
    return auth === auth2 && protocol === protocol2 && path === path2 && host === host2
  }

  onLoadUrl (url) {
    if (!this.isBack(url)) return
    if (this.state.onMessage) return
    this.startSendTokenRequest()
    this.setState({onMessage: evt => this.handleMessage(evt.nativeEvent.data)}, () => this.ref.reload())
  }

  handleMessage (message) {
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
    this.ref.postMessage('token')
  }

  render () {
    return <View style={style.view}>
      <WebView
        ref={ref => {this.ref = ref}}
        onMessage={this.state.onMessage}
        source={this.props.source}
        style={style.webView}
        onLoadStart={evt => this.onLoadUrl(evt.nativeEvent.url)}/>
      <FancyTextButton onPress={this.props.onCancel} text='Cancel login' style={style.button}/>
    </View>
  }
}

AuthWebView.propTypes = {
  source: WebView.propTypes.source,
  onCancel: React.PropTypes.func.isRequired,
  onAuthFailed: React.PropTypes.func.isRequired,
  onSuccess: React.PropTypes.func.isRequired
}

const style = StyleSheet.create({
  webView: {
    backgroundColor: constants.appBackgroundColor
  },
  view: {
    flex: 1,
  },
  button: {
    backgroundColor: constants.colorRed
  }
})

export default AuthWebView
