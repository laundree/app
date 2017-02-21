/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  StyleSheet,
  View,
  Button
} from 'react-native'

export default class Login extends React.Component {

  render () {
    return <View style={styles.container}>
      <Button
        onPress={() => this.props.stateHandler.logOut()}
        title='Log out'
        accessibilityLabel='Learn more about this purple button'
      />
    </View>
  }
}

Login.propTypes = {
  stateHandler: React.PropTypes.object.isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
