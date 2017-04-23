// @flow
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
import type { StateHandler } from '../../stateHandler'
import LoadingWebView from './LoadingWebView'
import config from '../../config'

const SignUpWebView = () => <LoadingWebView source={{uri: `${config.laundree.host}/auth/sign-up`}} viewStyle={loginApp.webViewView} style={loginApp.webView}/>
const ForgotWebView = () => <LoadingWebView source={{uri: `${config.laundree.host}/auth/forgot`}} viewStyle={loginApp.webViewView} style={loginApp.webView}/>
const PrivacyWebView = () => <LoadingWebView source={{uri: `${config.laundree.host}/privacy`}} viewStyle={loginApp.webViewView} style={loginApp.webView}/>

type Props = { stateHandler: StateHandler }
type State = { authFailed: boolean }
type Route = { index: number, cancelTitle: string, Element: any }
export default class LoginApp extends Backable<Props, State> {
  state = {authFailed: false}

  static googleRoute: Route = {
    index: 1,
    cancelTitle: 'login.cancel',
    Element: GoogleAuthWebView
  }

  static facebookRoute: Route = {
    index: 1,
    cancelTitle: 'login.cancel',
    Element: FacebookAuthWebView
  }

  static signUpRoute: Route = {
    index: 1,
    cancelTitle: 'login.close',
    Element: SignUpWebView
  }

  static privacyRoute: Route = {
    index: 1,
    cancelTitle: 'login.close',
    Element: PrivacyWebView
  }

  static emailPasswordRoute: Route = {
    index: 1,
    Element: EmailPasswordAuthView,
    cancelTitle: 'login.cancel'
  }

  static forgotRoute: Route = {
    index: 1,
    Element: ForgotWebView,
    cancelTitle: 'login.close'
  }

  renderScene ({index, Element, cancelTitle}: Route, navigator: Navigator) {
    switch (index) {
      case 0:
        this.backAction = null
        return <Login
          authFailed={this.state.authFailed}
          stateHandler={this.props.stateHandler}
          onOpenEmailPasswordAuth={() => navigator.push(LoginApp.emailPasswordRoute)}
          onOpenGoogleAuth={() => navigator.push(LoginApp.googleRoute)}
          onOpenFacebookAuth={() => navigator.push(LoginApp.facebookRoute)}
          onOpenSignUp={() => navigator.push(LoginApp.signUpRoute)}
          onOpenPrivacy={() => navigator.push(LoginApp.privacyRoute)}
        />
      case 1:
        this.backAction = () => navigator.pop()
        return <View style={{flex: 1}}>
          <Element
            stateHandler={this.props.stateHandler}
            onOpenForgot={() => navigator.push(LoginApp.forgotRoute)}
            onSuccess={({secret, userId}) => this.props.stateHandler.updateAuth({userId, token: secret})}
            onAuthFailed={() => {
              navigator.pop()
              this.setState({authFailed: true})
            }}/>
          <FancyTextButton
            onPress={() => navigator.pop()} id={cancelTitle}
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
