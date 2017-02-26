/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import {
  Navigator,
  View,
  StyleSheet,
  Text,
  BackAndroid
} from 'react-native'
import Login from './Login'
import constants from '../../constants'
import FacebookAuthWebView from './FacebookAuthWebView'
import GoogleAuthWebView from './GoogleAuthWebView'
import Backable from './Backable'

export default class LoginApp extends Backable {

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

  renderScene ({index, Element}, navigator) {
    switch (index) {
      case 0:
        this.backAction = null
        return <Login
          stateHandler={this.props.stateHandler}
          onOpenGoogleAuth={() => navigator.push(this.googleRoute)}
          onOpenFacebookAuth={() => navigator.push(this.facebookRoute)}
        />
      case 1:
        this.backAction = () => navigator.pop()
        return <Element
          onSuccess={({secret, userId}) => this.props.stateHandler.updateAuth(userId, secret)}
          onCancel={() => navigator.pop()}
          onAuthFailed={() => navigator.pop()}/>
      default:
        return null
    }
  }

  render () {
    return <Navigator
      initialRoute={{index: 0}}
      configureScene={(route, routeStack) => Navigator.SceneConfigs.FloatFromBottom}
      renderScene={(route, navigator) => <View style={styles.mainContainer}>
        {this.renderScene(route, navigator)}
      </View>}/>

  }
}
const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: constants.statusBarHeight,
    backgroundColor: constants.appBackgroundColor,
    flex: 1
  }
})

LoginApp.propTypes = {
  stateHandler: React.PropTypes.object
}
