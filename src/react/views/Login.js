/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Button
} from 'react-native'

export default class Login extends React.Component {

  constructor (props) {
    super(props)
    this.state = {email: '', password: ''}
  }

  render () {
    return <View style={styles.container}>
      <View style={styles.input}>
        <Text style={styles.label}>
          E-mail address
        </Text>
      </View>
      <View style={styles.input}>
        <TextInput
          style={styles.textInput}
          keyboardType={'email-address'}
          onChangeText={email => this.setState({email: email.toLowerCase().trim()})}
          value={this.state.email}
        />
      </View>
      <View style={styles.input}>
        <Text style={styles.label}>
          Password
        </Text>
      </View>
      <View style={styles.input}>
        <TextInput
          secureTextEntry
          style={styles.textInput}
          onChangeText={password => this.setState({password})}
          value={this.state.password}
        />
      </View>
      <View style={styles.input}>
        <View style={styles.buttonInput}>
          <Button
            onPress={() => this.props.stateHandler.loginEmailPassword(this.state.email, this.state.password)}
            title='Login'
            disabled={this.disabled}
            accessibilityLabel='Learn more about this purple button'
          />
        </View>
      </View>
    </View>
  }

  get disabled () {
    return !(this.state.email && this.state.password)
  }
}

Login.propTypes = {
  stateHandler: React.PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  login: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  label: {
    textAlign: 'left',
    flex: 1,
    paddingLeft: 5,
    marginTop: 20
  },
  input: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 4,
    padding: 4,
    flex: 1
  },
  buttonInput: {
    height: 40,
    marginTop: 20
  }
})
