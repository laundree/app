/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import LoginApp from './LoginApp'
import fetchStateHandler from '../../stateHandler'
import LoggedInApp from '../containers/LoggedInApp'
import { View, Text, StyleSheet, Navigator, Image, TouchableHighlight } from 'react-native'
import { Provider } from 'react-redux'
import constants from '../../constants'

export default class App extends React.Component {

  constructor (props) {
    super(props)
    this.state = {stateHandler: null, sesh: 0}
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
    return <View style={styles.mainContainer}>{this.renderContent()}</View>
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: constants.appBackgroundColor,
    flex: 1
  }
})

