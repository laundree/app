// @flow

/**
 * Main login page with social
 * login buttons
 */

import React from 'react'
import {
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

import { login } from '../style'
import type { StateHandler } from '../stateHandler'

type LoginProps = {
  stateHandler: StateHandler,
  onOpenGoogleAuth: Function,
  onOpenFacebookAuth: Function,
  onOpenSignUp: Function,
  onOpenEmailPasswordAuth: Function,
  onOpenPrivacy: Function,
  authFailed: boolean
}

export default class Login extends React.PureComponent<LoginProps> {
  /**
   * Renders a notice about the Terms and Conditions
   * and Privacy Policy
   */
  renderNotice () {
    return (
      <View style={login.infoContainer}>
        <View style={login.infoTopView}>
          <Text style={[login.infoText, login.infoTitleText]}>
            <FormattedMessage id='login.notice' />
          </Text>
          <Text style={login.infoText}>
            <FormattedMessage id='login.notice.text' />
          </Text>
        </View>
        <TouchableOpacity
          onPress={this.props.onOpenPrivacy}>
          <Text style={[login.infoText, login.infoLinkText]}>
            <FormattedMessage id='login.notice.terms' />
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * If authentication failed,
   * renders error message
   */
  renderAuthFailed () {
    if (!this.props.authFailed) return null
    return (
      <View style={login.authFailedView}>
        <Image source={require('../../img/error_240.png')} style={login.authFailedImage} />
        <Text style={login.authFailedText}>
          <FormattedMessage id='login.authentication.failed' />
        </Text>
      </View>)
  }

  renderLoginOptions () {
    return (
      <View style={login.optionsView}>
        <View style={login.optionView}>
          <FancyEmailButton onPress={this.props.onOpenEmailPasswordAuth} id='login.email' />
        </View>
        <View style={login.optionView}>
          <FancyFacebookButton onPress={this.props.onOpenFacebookAuth} id='login.facebook' />
        </View>
        <View style={login.optionView}>
          <FancyGoogleButton onPress={this.props.onOpenGoogleAuth} id='login.google' />
        </View>
        <TouchableOpacity onPress={this.props.onOpenSignUp}>
          <Text style={login.hintText}>
            <FormattedMessage id='login.hint' />
          </Text>
        </TouchableOpacity>
      </View>)
  }

  renderLogo () {
    return (
      <View style={login.logoView}>
        <Image
          style={login.logoImage}
          source={require('../../img/logo_large.png')} />
      </View>)
  }

  render () {
    return (
      <View style={login.container}>
        <ScrollView style={login.scrollView}>
          {this.renderLogo()}
          {this.renderAuthFailed()}
          {this.renderLoginOptions()}
        </ScrollView>
        {this.renderNotice()}
      </View>)
  }
}
