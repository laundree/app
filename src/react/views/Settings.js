/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  StyleSheet,
  View,
  Button,
  Text,
  Image
} from 'react-native'
import FancyTextButton from './input/FancyTextButton'
import constants from '../../constants'

export default class Settings extends React.Component {
  get user () {
    return this.props.users && this.props.users[this.props.currentUser]
  }

  renderUser () {
    if (!this.user) return null
    const {displayName, photo} = this.user
    console.log('User', photo)
    return <View>
      <Image
        style={{width: 50, height: 50}}
        source={{uri: photo}}/>
      <Text>
        {displayName}
      </Text>
    </View>
  }

  render () {
    return <View style={styles.container}>
      {this.renderUser()}
      <View style={{alignSelf: 'stretch', padding: 5, paddingTop: 30}}>
        <FancyTextButton
          style={{backgroundColor: constants.colorRed}}
          onPress={() => this.props.stateHandler.logOut()}
          text='Log out'
        />
      </View>
    </View>
  }
}

Settings.propTypes = {
  currentUser: React.PropTypes.string,
  users: React.PropTypes.object,
  stateHandler: React.PropTypes.object.isRequired
}

const styles = StyleSheet.create({
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
