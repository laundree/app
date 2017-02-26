/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  StyleSheet,
  TextInput,
  Text,
  View
} from 'react-native'
import FancyTextButton from './input/FancyTextButton'
import FancyTextInput from './input/FancyTextInput'
import FancyGoogleButton from './input/FancyGoogleButton'
import FancyFacebookButton from './input/FancyFacebookButton'
import constants from '../../constants'

class EmailPasswordLoginForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {email: '', password: ''}
  }

  render () {
    return <View>
      <View style={styles.input}>
        <FancyTextInput
          label={'E-mail address'} keyboardType={'email-address'} value={this.state.email}
          onChangeText={email => this.setState({email: email.trim()})}/>
      </View>
      <View style={styles.input}>
        <FancyTextInput
          label={'Password'} secureTextEntry value={this.state.password}
          onChangeText={password => this.setState({password})}/>
      </View>
      <View style={styles.buttonInput}>
        <FancyTextButton
          disabled={this.disabled}
          onPress={() => this.props.stateHandler.loginEmailPassword(this.state.email, this.state.password)}
          text="Login"/>
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
    return <View style={styles.container}>
      <View style={{alignSelf: 'stretch'}}>
        <View style={styles.socialLogin}>
          <View style={styles.socialButton}>
            <FancyFacebookButton onPress={this.props.onOpenFacebookAuth} text="Login with Facebook"/>
          </View>
          <View style={styles.socialButton}>
            <FancyGoogleButton onPress={this.props.onOpenGoogleAuth} text="Login with Google"/>
          </View>
        </View>
        <View style={styles.divider}>
          <Text style={styles.dividerText}>
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

const styles = StyleSheet.create({
  divider: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  dividerText: {
    fontWeight: 'bold',
    color: constants.defaultTextColor
  },
  socialLogin: {
    padding: 5
  },
  socialButton: {
    paddingTop: 30,
    paddingBottom: 10
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  login: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  input: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingTop: 10
  },
  buttonInput: {
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
    paddingTop: 30
  }
})
