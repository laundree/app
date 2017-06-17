// @flow

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
import locales from '../../../locales'

export default class App extends React.Component {
  state: { stateHandler: ?StateHandler, sesh: number, isConnected: boolean } = {stateHandler: null, sesh: 0, isConnected: true}

  componentDidMount () {
    fetchStateHandler()
      .then(stateHandler => {
        stateHandler.on('authChange', () => this.setState(({sesh}) => ({sesh: sesh + 1})))
        this.setState({stateHandler})
        stateHandler.on('connectionChange', (isConnected) => this.setState({isConnected}))
      })
  }

  renderContent () {
    if (!this.state.stateHandler) return null
    if (!this.state.isConnected) return <OfflineApp>You are offline</OfflineApp>
    if (!this.state.stateHandler.isAuthenticated) {
      return <LoginApp stateHandler={this.state.stateHandler}/>
    }
    return <Provider store={this.state.stateHandler.store}>
      <LoggedInApp stateHandler={this.state.stateHandler}/>
    </Provider>
  }

  render () {
    if (!this.state.stateHandler) return null
    const locale = this.state.stateHandler.locale
    return <IntlProvider locale={locale} messages={locales[locale].messages} textComponent={Text}>
      <View style={app.mainContainer}>{this.renderContent()}</View>
    </IntlProvider>
  }
}
