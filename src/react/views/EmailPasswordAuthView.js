// @flow
import React from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import type { StateHandler } from '../../stateHandler'
import { login } from '../../style'
import FancyTextButton from './input/FancyTextButton'
import FancyTextInput from './input/FancyTextInput'
import uuid from 'uuid'
import { FormattedMessage } from 'react-intl'

export default class EmailPasswordAuthView extends React.Component {
  state = {email: '', password: '', loading: false}

  props: {
    stateHandler: StateHandler,
    onSuccess: () => void,
    onAuthFailed: () => void,
    onOpenForgot: () => void
  }

  async login () {
    const {email, password} = this.state
    this.setState({loading: true})
    try {
      const {secret, owner: {id}} = await this.props.stateHandler.sdk.api.token
        .createTokenFromEmailPassword(`app-${uuid.v4()}`, email, password)
      this.props.onSuccess({secret, userId: id})
    } catch (err) {
      this.props.onAuthFailed(err)
    }
    this.setState({loading: false})
  }

  render () {
    // TODO FancyTextInput should use formatMessage
    return <View style={login.emailFormContainer}>
      <View style={login.input}>
        <FancyTextInput
          label={'E-mail address'} keyboardType={'email-address'} value={this.state.email}
          onChangeText={email => this.setState({email: email.trim()})} />
      </View>
      <View style={login.input}>
        <FancyTextInput
          label={'Password'} secureTextEntry value={this.state.password}
          onChangeText={password => this.setState({password})} />
      </View>
      <View style={login.buttonInput}>
        <FancyTextButton
          disabled={this.isDisabled()}
          onPress={() => this.login()}
          id='login.button' />
      </View>
      <TouchableOpacity onPress={this.props.onOpenForgot}>
        <Text style={login.hintText}>
          <FormattedMessage id='login.forgotpassword' />
        </Text>
      </TouchableOpacity>
    </View>
  }

  isDisabled () {
    return Boolean(!(this.state.email && this.state.password && !this.state.loading))
  }
}
