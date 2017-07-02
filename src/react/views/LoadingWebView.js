// @flow
import React from 'react'
import {
  WebView,
  View,
  ActivityIndicator,
  Modal
} from 'react-native'
import { constants, loader } from '../../style'
type Event = { nativeEvent: { url: string, data: string } }
export default class LoadingWebView extends React.Component {
  state: { loaded: boolean } = {loaded: false}
  props: {
    injectedJavaScript?: string,
    viewStyle?: {},
    webViewRef?: () => WebView,
    onMessage?: (evt: Event) => any,
    onLoadStart?: (evt: Event) => any,
    style?: {},
    source?: {}
  }

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
          onLoadEnd={() => this.setState({loaded: true})}
          injectedJavaScript={this.props.injectedJavaScript}
          userAgent={'laundree-app-android'}
          automaticallyAdjustContentInsets={false} />
      </View>
    )
  }
}
