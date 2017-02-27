/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  Text,
  View
} from 'react-native'
import FancyTextButton from './input/FancyTextButton'
import FancyTextInput from './input/FancyTextInput'
import FancyGoogleButton from './input/FancyGoogleButton'
import FancyFacebookButton from './input/FancyFacebookButton'
import { login } from '../../style'

class EmailPasswordLoginForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {email: '', password: ''}
  }

  render () {
    return <View>
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
          onPress={() => this.props.stateHandler.loginEmailPassword(this.state.email, this.state.password)}
          text='Login'/>
      </View>
    </View>
  }

  get disabled () {
    return Boolean(!(this.state.email && this.state.password))
  }

}

EmailPasswordLoginForm.propTypes = {
  stateHandler: React.PropTypes.object.isRequired
}

export default class Login extends React.Component {

  render () {
    return <View style={login.container}>
      <View style={{alignSelf: 'stretch'}}>
        <View style={login.socialLogin}>
          <View style={login.socialButton}>
            <FancyFacebookButton onPress={this.props.onOpenFacebookAuth} text='Login with Facebook'/>
          </View>
          <View style={login.socialButton}>
            <FancyGoogleButton onPress={this.props.onOpenGoogleAuth} text='Login with Google'/>
          </View>
        </View>
        <View style={login.divider}>
          <Text style={login.dividerText}>
            OR
          </Text>
        </View>
        <EmailPasswordLoginForm stateHandler={this.props.stateHandler}/>
      </View>
    </View>
  }
}

Login.propTypes = {
  stateHandler: React.PropTypes.object.isRequired,
  onOpenGoogleAuth: React.PropTypes.func.isRequired,
  onOpenFacebookAuth: React.PropTypes.func.isRequired
}
