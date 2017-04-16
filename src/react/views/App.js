/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import LoginApp from './LoginApp'
import fetchStateHandler from '../../stateHandler'
import LoggedInApp from '../containers/LoggedInApp'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import { app } from '../../style'
import OneSignal from 'react-native-onesignal'

export default class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {stateHandler: null, sesh: 0}
  }

  componentWillMount () {
    OneSignal.addEventListener('received', this.onReceived)
    OneSignal.addEventListener('opened', this.onOpened)
    OneSignal.addEventListener('registered', this.onRegistered)
    OneSignal.addEventListener('ids', this.onIds)
    console.log('componentWillMount')
  }

  componentWillUnmount () {
    OneSignal.removeEventListener('received', this.onReceived)
    OneSignal.removeEventListener('opened', this.onOpened)
    OneSignal.removeEventListener('registered', this.onRegistered)
    OneSignal.removeEventListener('ids', this.onIds)
  }

  onReceived (notification) {
    console.log('Notification received: ', notification)
  }

  onOpened (openResult) {
    console.log('Message: ', openResult.notification.payload.body)
    console.log('Data: ', openResult.notification.payload.additionalData)
    console.log('isActive: ', openResult.notification.isAppInFocus)
    console.log('openResult: ', openResult)
  }

  onRegistered (notifData) {
    console.log('Device had been registered for push notifications!', notifData)
  }

  onIds (device) {
    console.log('User ID: ', device.userId)
  }

  componentDidMount () {
    fetchStateHandler().then(stateHandler => {
      stateHandler.on('authChange', () => this.setState(({sesh}) => ({sesh: sesh + 1})))
      this.setState({stateHandler})
    })
  }

  renderLogin () {
    return <LoginApp stateHandler={this.state.stateHandler}/>
  }

  renderContent () {
    if (!this.state.stateHandler) return null
    if (!this.state.stateHandler.isAuthenticated) {
      return this.renderLogin()
    }
    return <Provider store={this.state.stateHandler.store}>
      <LoggedInApp stateHandler={this.state.stateHandler}/>
    </Provider>
  }

  render () {
    OneSignal.setSubscription(true)
    return <View style={app.mainContainer}>{this.renderContent()}</View>
  }
}
