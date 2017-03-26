/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'
import FancyTextButton from './input/FancyTextButton'
import {settings} from '../../style'

export default class Settings extends React.Component {
  get user () {
    return this.props.users && this.props.users[this.props.currentUser]
  }

  renderUser () {
    if (!this.user) return null
    const {displayName, photo} = this.user
    console.log('User', photo)
    return <View>
      <Text>Basic user-info</Text>
      <Image
        style={{width: 50, height: 50}}
        source={{uri: photo}}/>
      <Text>
        {displayName}
      </Text>
      <Text>E-mail address</Text>
      <Text>blabla@blabla.bla</Text>
      <Text>Laundries</Text>
      <Text>Laundry 1</Text>
    </View>
  }

  render () {
    return <View style={settings.container}>
      {this.renderUser()}
      <View style={{alignSelf: 'stretch', padding: 5, paddingTop: 30}}>
        <FancyTextButton
          style={settings.textButton}
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

