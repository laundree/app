// @flow
import React from 'react'
import {
  WebView,
  View,
  ActivityIndicator,
  Modal
} from 'react-native'
import { constants, loader } from '../style'
type Event = { nativeEvent: { url: string, data: string } }

type LoadingWebViewProps = {
  fakeUserAgent?: boolean,
  injectedJavaScript?: string,
  viewStyle?: number,
  webViewRef?: () => WebView,
  onMessage?: (evt: Event) => any,
  onLoadStart?: (evt: Event) => any,
  style?: number,
  source?: {}
}

export default class LoadingWebView extends React.PureComponent<LoadingWebViewProps, {loaded: boolean}> {
  state = {loaded: false}

  _onLoadEnd = () => this.setState({loaded: true})

  render () {
    return (
      <View style={this.props.viewStyle}>
        <Modal transparent visible={!this.state.loaded} animationType='fade' onRequestClose={() => {}}>
          <ActivityIndicator color={constants.darkTheme} size='large' style={loader.activityIndicator} />
        </Modal>
        <WebView
          ref={this.props.webViewRef}
          source={this.props.source}
          style={this.props.style}
          onLoadStart={this.props.onLoadStart}
          onMessage={this.props.onMessage}
          onLoadEnd={this._onLoadEnd}
          injectedJavaScript={this.props.injectedJavaScript}
          userAgent={this.props.fakeUserAgent ? 'Mozilla/5.0' : undefined}
          automaticallyAdjustContentInsets={false} />
      </View>
    )
  }
}
