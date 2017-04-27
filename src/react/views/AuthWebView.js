// @flow
import React from 'react'
import LoadingWebView from './LoadingWebView'
import { authWebView } from '../../style'
import { Linking } from 'react-native'
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
  handle = (evt: { url: string }) => this._handleOpenURL(evt)

  componentDidMount () {
    this.check()
    Linking.addEventListener('url', this.handle)
  }

  componentWillUnmount () {
    Linking.removeEventListener('url', this.handle)
  }

  _handleOpenURL (event) {
    this.handleUrl(event.url)
  }

  async check () {
    const url = await Linking.getInitialURL()
    this.handleUrl(url)
  }

  handleUrl (u: ?string) {
    console.log('Handling url', u)
    if (!u) {
      return
    }
    const parsed = url.parse(u)
    if (parsed.protocol !== 'laundree:') {
      return
    }
    if (parsed.hostname !== 'auth') {
      return
    }
    const pattern = /^\/([^/]+)\/([^/]+)$/
    const matches = parsed.path.match(pattern)
    if (!matches) {
      return
    }
    this.props.onSuccess({userId: matches[1], secret: matches[2]})
  }

  render () {
    return <LoadingWebView
      viewStyle={authWebView.view}
      source={this.props.source}
      style={authWebView.webView}/>
  }
}

export default AuthWebView
