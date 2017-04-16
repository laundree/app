/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Linking
} from 'react-native'
import AuthWebView from './AuthWebView'
import { login } from '../../style'
import FancyTextButton from './input/FancyTextButton'
import FancyTextInput from './input/FancyTextInput'
import uuid from 'uuid'

export default class EmailPasswordAuthView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {email: '', password: ''}
  }
  login() {
    const {email, password} = this.state
    return this.props.stateHandler.sdk.token
      .createTokenFromEmailPassword(`app-${uuid.v4()}`, email, password)
      .then(({secret, owner: {id}}) => this.props.onSuccess({secret, userId: id}))
      .catch(this.props.onAuthFailed)
  }
  render () {
    return <View style={login.emailFormContainer}>
      <View style={login.input}>
        <FancyTextInput
          label={'E-mail address'} keyboardType={'email-address'} value={this.state.email}
          onChangeText={email => this.setState({email: email.trim()})}/>
      </View>
      <View style={login.input}>
        <FancyTextInput
          label={'Password'} secureTextEntry value={this.state.password}
          onChangeText={password => this.setState({password})}/>
      </View>
      <View style={login.buttonInput}>
        <FancyTextButton
          disabled={this.disabled}
          onPress={() => this.login()}
          text='Login'/>
      </View>
      <TouchableOpacity onPress={() => Linking.openURL('https://laundree.io/auth/forgot')}>
        <Text style={login.hint}>Forgot your password? Reset it here</Text>
      </TouchableOpacity>
    </View>
  }

  get disabled () {
    return Boolean(!(this.state.email && this.state.password))
  }

}

EmailPasswordAuthView.propTypes = {
  stateHandler: React.PropTypes.object.isRequired,
  onSuccess: AuthWebView.propTypes.onSuccess,
  onAuthFailed: AuthWebView.propTypes.onAuthFailed
}
