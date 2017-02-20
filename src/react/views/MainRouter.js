/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import Login from './Login'
import StateHandler from '../../stateHandler'
import { Provider } from 'react-redux'

export default class MainRouter extends React.Component {

  constructor (props) {
    super(props)
    this.stateHandler = new StateHandler()
  }

  componentDidMount () {
  }

  renderContent () {
    return <Login stateHandler={this.stateHandler}/>
  }

  render () {
    return <Provider store={this.stateHandler.store}>
      {this.renderContent()}
    </Provider>
  }
}
