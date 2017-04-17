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

  get laundry () {
    return this.props.laundry && this.props.laundry.name
  }

  renderUser () {
    if (!this.user) return null
    const {displayName, photo} = this.user
    return <View style={settings.userView}>
        <Image
          style={settings.userImage}
          source={{uri: photo}}/>
        <View style={settings.userNameView}>
          <Text style={settings.userName}>{displayName}</Text>
        </View>
      </View>
  }

  renderLaundry () {
    return <View style={settings.settingsView}>
      {this.laundry
        ? (
          <View style={settings.laundryView}>
            <Text style={settings.laundryHeader}>Laundry</Text>
            <Text style={settings.laundryName}>{this.laundry}</Text>
          </View>)
        : null}
      <View style={settings.logOut}>
        <FancyTextButton
          style={settings.textButton}
          onPress={() => this.props.stateHandler.logOut()}
          text='Log out'
        />
      </View>
    </View>
  }

  render () {
    return <View style={settings.container}>
      {this.renderUser()}
      {this.renderLaundry()}
    </View>
  }
}

Settings.propTypes = {
  currentUser: React.PropTypes.string,
  users: React.PropTypes.object,
  laundry: React.PropTypes.object.isRequired,
  stateHandler: React.PropTypes.object.isRequired
}
