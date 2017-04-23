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
import { FormattedMessage } from 'react-intl'

import { login } from '../../style'

export default class Login extends React.Component {
  renderNotion () {
    return (
      <View style={login.infoContainer}>
        <View style={login.infoTop}>
          <Text style={[login.infoText, login.infoTitle]}>
            <FormattedMessage id='login.notice'/>
          </Text>
          <Text style={login.infoText}>
            <FormattedMessage id='login.notice.text'/>
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://laundree.io/privacy')}
        >
          <Text style={[login.infoText, login.infoLink]}>
            <FormattedMessage id='login.notice.terms'/>
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
              <FormattedMessage id='login.authentication.failed'/>
            </Text>
          </View>
        )
        : null
      }
      <View style={login.socialLogin}>
        <View style={login.socialButton}>
          <FancyEmailButton onPress={this.props.onOpenEmailPasswordAuth} id='login.email'/>
        </View>
        <View style={login.socialButton}>
          <FancyFacebookButton onPress={this.props.onOpenFacebookAuth} id='login.facebook'/>
        </View>
        <View style={login.socialButton}>
          <FancyGoogleButton onPress={this.props.onOpenGoogleAuth} id='login.google'/>
        </View>
        <TouchableOpacity onPress={() => Linking.openURL('https://laundree.io/auth/sign-up')}>
          <Text style={login.hint}>
            <FormattedMessage id='login.hint'/>
          </Text>
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
