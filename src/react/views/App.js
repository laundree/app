// @flow

/**
 * Module in charge of rendering either the scene
 * for logging in, the logged in application, or
 * an offline scene if there is no network connection.
 * Also provides internationalisation through the
 * IntlProvider wrapper.
 */
import {Buffer} from 'buffer/'
import React from 'react'
import LoginApp from './LoginApp'
import OfflineApp from './OfflineApp'
import fetchStateHandler from '../../stateHandler'
import LoggedInApp from '../containers/LoggedInApp'
import { Text, View } from 'react-native'
import { Provider } from 'react-redux'
import { app } from '../../style'
import type { StateHandler } from '../../stateHandler'
import { IntlProvider } from 'react-intl'
import {messages} from '../../../locales'
global.Buffer = Buffer
// $FlowFixMe We are going to set this and thats final!
console.ignoredYellowBox = [
  'Setting a timer' // TODO remove this when https://github.com/facebook/react-native/issues/12981 has been resolved
]

type AppState = { stateHandler: ?StateHandler, sesh: number, isConnected: boolean }

export default class App extends React.Component {
  state: AppState = { stateHandler: null, sesh: 0, isConnected: true }

  /**
   * Fetches the state handler and listens for
   * authentication and network connection.
   * 'sesh' is only used for triggering a rerender.
   */
  componentDidMount () {
    fetchStateHandler()
      .then(stateHandler => {
        stateHandler.on('authChange', () => this.setState(({sesh}) => ({sesh: sesh + 1})))
        this.setState({stateHandler})
        stateHandler.on('connectionChange', (isConnected) => this.setState({isConnected}))
      })
  }

  /**
   * Returns either null (if state handler is not set),
   * the offline scene (if there is no network connection),
   * the scene for logging in, or the logged in app.
   */
  renderContent () {
    if (!this.state.stateHandler) return null
    if (!this.state.isConnected) return <OfflineApp />
    if (!this.state.stateHandler.isAuthenticated) {
      return <LoginApp stateHandler={this.state.stateHandler} />
    }
    return <Provider store={this.state.stateHandler.store}>
      <LoggedInApp stateHandler={this.state.stateHandler} />
    </Provider>
  }

  /**
   * Returns the resulting view from renderContent wrapped
   * in IntlProvider for internationalisation.
   */
  render () {
    if (!this.state.stateHandler) return null
    const locale = this.state.stateHandler.locale
    return <IntlProvider locale={locale} messages={messages[locale]} textComponent={Text}>
      <View style={app.mainContainer}>{this.renderContent()}</View>
    </IntlProvider>
  }
}
