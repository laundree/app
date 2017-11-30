// @flow

/**
 * Handles the scene for logging in
 */
import React from 'react'
import { View, Text } from 'react-native'

import { StackNavigator } from 'react-navigation'

import Login from './Login'
import { loginApp } from '../style'
import FacebookAuthWebView from './FacebookAuthWebView'
import GoogleAuthWebView from './GoogleAuthWebView'
import EmailPasswordAuthView from './EmailPasswordAuthView'
import FancyTextButton from './input/FancyTextButton'
import LoadingWebView from './LoadingWebView'
import config from '../config'
import { FormattedMessage } from 'react-intl'
import { StateHandler } from '../stateHandler'

type ScreenProps = {
  authFailed: boolean,
  stateHandler: StateHandler,
  onAuthFailed: (boolean) => void
}

class LoginScreen extends React.PureComponent<{ screenProps: ScreenProps, navigation: * }> {
  static navigationOptions = {
    headerTitle: (
      <View style={loginApp.navBarContainer}>
        <Text style={loginApp.navBarTitle}><FormattedMessage id='login.title' /></Text>
      </View>
    )
  }

  render () {
    const {authFailed, stateHandler} = this.props.screenProps
    const navigate = this.props.navigation.navigate
    return (
      <View style={loginApp.mainContainer}>
        <Login
          authFailed={authFailed}
          stateHandler={stateHandler}
          onOpenEmailPasswordAuth={() => navigate('EmailPasswordAuth')}
          onOpenGoogleAuth={() => navigate('GoogleAuth')}
          onOpenFacebookAuth={() => navigate('FacebookAuth')}
          onOpenSignUp={() => navigate('SignUp')}
          onOpenPrivacy={() => navigate('Privacy')}
        />
      </View>
    )
  }
}

class Screen extends React.PureComponent<{ screenProps: ScreenProps, navigation: * }> {
  Element: *
  cancelTitle = 'login.cancel'

  back = () => this.props.navigation.goBack()

  render () {
    const {stateHandler, onAuthFailed} = this.props.screenProps
    const E = this.Element
    return (
      <View style={[loginApp.cancelView, loginApp.mainContainer]}>
        <E
          stateHandler={stateHandler}
          onOpenForgot={() => this.props.navigation.navigate('Forgot')}
          onSuccess={({secret, userId}) => stateHandler.updateAuth({userId, token: secret})}
          onAuthFailed={() => {
            this.back()
            onAuthFailed(true)
          }} />
        <FancyTextButton
          onPress={this.back}
          id={this.cancelTitle}
          style={loginApp.cancelButton} />
      </View>)
  }
}

class GoogleAuthScreen extends Screen {
  Element = GoogleAuthWebView
}

class FacebookAuthScreen extends Screen {
  Element = FacebookAuthWebView
}

class EmailPasswordAuthScreen extends Screen {
  Element = EmailPasswordAuthView
}

const ForgotWebView = () => <LoadingWebView
  source={{uri: `${config.laundree.host}/auth/forgot`}}
  viewStyle={loginApp.webViewView} style={loginApp.webView} />

class ForgotScreen extends Screen {
  cancelTitle = 'login.close'

  Element = ForgotWebView
}

const SignUpWebView = () => <LoadingWebView
  source={{uri: `${config.laundree.host}/auth/sign-up`}}
  viewStyle={loginApp.webViewView} style={loginApp.webView} />

class SignUpScreen extends Screen {
  cancelTitle = 'login.close'

  Element = SignUpWebView
}

const PrivacyWebView = () => <LoadingWebView
  source={{uri: `${config.laundree.host}/privacy`}}
  viewStyle={loginApp.webViewView} style={loginApp.webView} />

class PrivacyScreen extends Screen {
  cancelTitle = 'login.close'

  Element = PrivacyWebView
}

const Stack = StackNavigator({
  Login: {screen: LoginScreen},
  GoogleAuth: {screen: GoogleAuthScreen},
  FacebookAuth: {screen: FacebookAuthScreen},
  EmailPasswordAuth: {screen: EmailPasswordAuthScreen},
  Forgot: {screen: ForgotScreen},
  Privacy: {screen: PrivacyScreen},
  SignUp: {screen: SignUpScreen}
}, {
  navigationOptions: ({navigation}) => {
    return {
      headerStyle: loginApp.navBar,
      headerTitleStyle: loginApp.navBarTitle,
      headerBackTitleStyle: loginApp.navBarBack,
      headerTintColor: '#fff'
    }
  }
})

export default class LoginApp extends React.PureComponent<{ stateHandler: StateHandler }, { authFailed: boolean }> {
  state = {authFailed: false}

  /**
   * Returns a Navigator that handles
   * which scene to show; default is
   * the scene with login buttons etc.
   */
  render () {
    return <Stack screenProps={{
      authFailed: this.state.authFailed,
      stateHandler: this.props.stateHandler,
      onAuthFailed: (authFailed) => this.setState({authFailed})
    }} />
  }
}
