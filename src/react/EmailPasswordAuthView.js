// @flow
import React from 'react'
import {
  View,
  TouchableOpacity,
  Text
} from 'react-native'
import type { StateHandler } from '../stateHandler'
import { login } from '../style'
import FancyTextButton from './input/FancyTextButton'
import FancyTextInput from './input/FancyTextInput'
import uuid from 'uuid'
import { FormattedMessage } from 'react-intl'

type EmailPasswordAuthViewProps = {
  stateHandler: StateHandler,
  onSuccess: ({ secret: string, userId: string }) => void,
  onAuthFailed: (err: Error) => void,
  onOpenForgot: () => void
}

export default class EmailPasswordAuthView extends React.PureComponent<EmailPasswordAuthViewProps, { email: string, password: string, loading: boolean }> {
  state = {email: '', password: '', loading: false}

  async login () {
    const {email, password} = this.state
    this.setState({loading: true})
    try {
      console.log(email, password)
      const {secret, owner: {id}} = await this.props.stateHandler.sdk.api.token
        .createTokenFromEmailPassword({name: `app-${uuid.v4()}`, email, password})
      this.props.onSuccess({secret, userId: id})
    } catch (err) {
      console.log(err)
      this.props.onAuthFailed(err)
    }
    this.setState({loading: false})
  }

  render () {
    // TODO FancyTextInput should use formatMessage
    return (
      <View style={login.emailFormContainer}>
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
      </View>)
  }

  isDisabled () {
    return Boolean(!(this.state.email && this.state.password && !this.state.loading))
  }
}
