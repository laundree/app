/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import {
  View,
  Text,
  Image,
  Switch
} from 'react-native'
import FancyTextButton from './input/FancyTextButton'
import {settings} from '../../style'
import { FormattedMessage } from 'react-intl'

export default class Settings extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      notificationsEnabled: true
    }
  }

  componentDidMount () {
    this.fetchData()
  }

  async fetchData () {
    const enabled = await this.props.stateHandler.notificationSettings
    this.setState({ notificationsEnabled: enabled })
  }

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
            <Text style={settings.laundryHeader}>
              <FormattedMessage id='settings.laundry'/>
            </Text>
            <Text style={settings.laundryName}>{this.laundry}</Text>
          </View>)
        : null}
    </View>
  }

  onToggleNotifications (value) {
    this.props.stateHandler.saveNotificationSetting(value)
    this.setState({notificationsEnabled: value})
  }

  renderNotifications () {
    return <View style={settings.notificationView}>
      <View style={settings.notificationHeaderView}>
        <Text style={settings.notificationHeader}>
          <FormattedMessage id='settings.notifications'/>
        </Text>
      </View>
      <View style={settings.notificationRow}>
        <Text style={settings.notificationText}>
            <FormattedMessage id='settings.notifications.text'/>
        </Text>
        <Switch
          onValueChange={(value) => this.onToggleNotifications(value)}
          value={this.state.notificationsEnabled}/>
      </View>
    </View>
  }

  renderLogOut () {
    return <View style={settings.logOut}>
      <FancyTextButton
        style={settings.textButton}
        onPress={() => this.props.stateHandler.logOut()}
        id='settings.logout'
      />
    </View>
  }

  render () {
    return <View style={settings.container}>
      {this.renderUser()}
      {this.renderLaundry()}
      {this.renderNotifications()}
      {this.renderLogOut()}
    </View>
  }
}

Settings.propTypes = {
  currentUser: React.PropTypes.string,
  users: React.PropTypes.object,
  laundry: React.PropTypes.object.isRequired,
  stateHandler: React.PropTypes.object.isRequired
}
