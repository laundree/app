/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  Linking,
  Text,
  Image,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native'
import FancyGoogleButton from './input/FancyGoogleButton'
import FancyFacebookButton from './input/FancyFacebookButton'
import FancyEmailButton from './input/FancyEmailButton'
import { FBLogin, FBLoginManager } from 'react-native-facebook-login'

import { login } from '../../style'

export default class Login extends React.Component {
  renderNotion () {
    return (
      <View style={login.infoContainer}>
        <Text style={[login.infoText, login.infoTitle]}>
          Notice:
        </Text>
        <Text style={login.infoText}>
          By logging in without an account you
          are registered and accept our
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://laundree.io/privacy')}
        >
          <Text style={[login.infoText, login.infoLink]}>
            Terms and Conditions and Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    return <View style={{flex: 1}}>
      <ScrollView style={login.container}>
        <View style={login.logo}>
          <Image
            style={login.logoImage}
            source={require('../../../img/logo_large.png')}/>
        </View>
        {this.props.authFailed
          ? (
            <View style={login.authFailed}>
              <Image source={require('../../../img/error_240.png')} style={login.authFailedImage}/>
              <Text style={login.authFailedText}>
                Authentication failed
              </Text>
            </View>
          )
          : null
        }
        <View style={login.socialLogin}>
          <FBLogin
            ref={(fbLogin) => { this.fbLogin = fbLogin }}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            permissions={['email', 'user_friends']}
            onLogin={function (e) { console.log(e) }}
            onLoginFound={function (e) { console.log(e) }}
            onLoginNotFound={function (e) { console.log(e) }}
            onLogout={function (e) { console.log(e) }}
            onCancel={function (e) { console.log(e) }}
            onPermissionsMissing={function (e) { console.log(e) }}
          />
          <View style={login.socialButton}>
            <FancyEmailButton onPress={this.props.onOpenEmailPasswordAuth} text='Login with Email and Password'/>
          </View>
          <View style={login.socialButton}>
            <FancyFacebookButton onPress={this.props.onOpenFacebookAuth} text='Login with Facebook'/>
          </View>
          <View style={login.socialButton}>
            <FancyGoogleButton onPress={this.props.onOpenGoogleAuth} text='Login with Google'/>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL('https://laundree.io/auth/sign-up')}>
            <Text style={login.hint}>Don't have an account? Sign-up here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {this.renderNotion()}
    </View>
  }

}

Login.propTypes = {
  stateHandler: React.PropTypes.object.isRequired,
  onOpenGoogleAuth: React.PropTypes.func.isRequired,
  onOpenFacebookAuth: React.PropTypes.func.isRequired,
  onOpenEmailPasswordAuth: React.PropTypes.func.isRequired,
  authFailed: React.PropTypes.bool
}
