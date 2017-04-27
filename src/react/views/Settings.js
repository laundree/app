// @flow

import React from 'react'
import {
  View,
  ScrollView,
  Text,
  Image,
  Switch
} from 'react-native'
import FancyTextButton from './input/FancyTextButton'
import { settings } from '../../style'
import { FormattedMessage } from 'react-intl'
import type { StateHandler } from '../../stateHandler'
import type { Col, User, Laundry } from '../../reduxTypes'

export default class Settings extends React.Component {
  state = {
    notificationsEnabled: true
  }

  props: {
    currentUser: string,
    users: Col<User>,
    laundry: ?Laundry,
    stateHandler: StateHandler
  }

  componentDidMount () {
    this.fetchData()
  }

  async fetchData () {
    const enabled = await this.props.stateHandler.fetchNotificationSettings()
    this.setState({notificationsEnabled: enabled})
  }

  user () {
    return this.props.users && this.props.users[this.props.currentUser]
  }

  laundry () {
    return this.props.laundry && this.props.laundry.name
  }

  renderUser () {
    const user = this.user()
    if (!user) return null
    const {displayName, photo} = user
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
    const laundry = this.laundry()
    return laundry
      ? (
        <View style={settings.settingsView}>
          <View style={settings.settingsHeaderView}>
            <Text style={settings.settingsHeader}>
              <FormattedMessage id='settings.laundry'/>
            </Text>
          </View>
          <View style={settings.settingsRow}>
            <Text style={settings.settingsText}>{laundry}</Text>
          </View>
        </View>)
      : null
  }

  onToggleNotifications (value: boolean) {
    this.props.stateHandler.saveNotificationSetting(value)
    this.setState({notificationsEnabled: value})
  }

  renderNotifications () {
    return <View style={settings.settingsView}>
      <View style={settings.settingsHeaderView}>
        <Text style={settings.settingsHeader}>
          <FormattedMessage id='settings.notifications'/>
        </Text>
      </View>
      <View style={settings.settingsRow}>
        <Text style={settings.settingsText}>
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
      <ScrollView style={settings.scrollContainer}>
        {this.renderUser()}
        {this.renderLaundry()}
        {this.renderNotifications()}
      </ScrollView>
      {this.renderLogOut()}
    </View>
  }
}
