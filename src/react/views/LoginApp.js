/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import {
  Navigator,
  View
} from 'react-native'
import Login from './Login'
import { loginApp, constants } from '../../style'
import FacebookAuthWebView from './FacebookAuthWebView'
import GoogleAuthWebView from './GoogleAuthWebView'
import EmailPasswordAuthView from './EmailPasswordAuthView'
import FancyTextButton from './input/FancyTextButton'
import Backable from './Backable'

export default class LoginApp extends Backable {

  constructor (props) {
    super(props)
    this.state = {authFailed: false}
  }

  get googleRoute () {
    return {
      index: 1,
      Element: GoogleAuthWebView
    }
  }

  get facebookRoute () {
    return {
      index: 1,
      Element: FacebookAuthWebView
    }
  }

  get emailPasswordRoute () {
    return {
      index: 1,
      Element: EmailPasswordAuthView
    }
  }

  renderScene ({index, Element}, navigator) {
    switch (index) {
      case 0:
        this.backAction = null
        return <Login
          authFailed={this.state.authFailed}
          stateHandler={this.props.stateHandler}
          onOpenEmailPasswordAuth={() => navigator.push(this.emailPasswordRoute)}
          onOpenGoogleAuth={() => navigator.push(this.googleRoute)}
          onOpenFacebookAuth={() => navigator.push(this.facebookRoute)}
        />
      case 1:
        this.backAction = () => navigator.pop()
        return <View style={{flex: 1}}>
          <Element
            stateHandler={this.props.stateHandler}
            onSuccess={({secret, userId}) => this.props.stateHandler.updateAuth(userId, secret)}
            onAuthFailed={() => {
              navigator.pop()
              this.setState({authFailed: true})
            }}/>
          <FancyTextButton
            onPress={() => navigator.pop()} id='login.cancel'
            style={{backgroundColor: constants.colorRed}}/>
        </View>
      default:
        return null
    }
  }

  render () {
    return <Navigator
      initialRoute={{index: 0}}
      configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
      renderScene={(route, navigator) => <View style={loginApp.mainContainer}>
        {this.renderScene(route, navigator)}
      </View>}
    />
  }
}

LoginApp.propTypes = {
  stateHandler: React.PropTypes.object
}
