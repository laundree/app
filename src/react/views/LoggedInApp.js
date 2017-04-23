// @flow

import React from 'react'
import { View, Text, Navigator, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import Timetable from '../containers/Timetable'
import Settings from './../containers/Settings'
import BookingList from '../containers/BookingList'
import QrCodeScanner from './QrCodeScanner'
import QrCodeScannerCamera from './QrCodeScannerCamera'
import Backable from './Backable'
import { loggedInApp, constants } from '../../style'
import OneSignal from 'react-native-onesignal'
import Fade from './animation/Fade'
import type { User, Laundry, Col } from '../../reduxTypes'
import type { NavigatorSceneConfig } from 'react-native'
import { FormattedMessage } from 'react-intl'

type Props = {
  currentUser: ?string,
  users: Col<User>,
  laundries: Col<Laundry>,
  stateHandler: React.PropTypes.object.isRequired
}

type Route = {
  title: string,
  id: string,
  index: number,
  hideBookings?: boolean,
  sceneConfig?: NavigatorSceneConfig
}

export default class LoggedInApp extends Backable<Props, void> {
  navigator: Navigator

  onIds = (device: { userId: string }) => {
    console.log('Got id', device.userId)
    this.props.stateHandler.updateOneSignalId(device.userId)
  }

  componentWillMount () {
    console.log('Waiting for id')
    OneSignal.addEventListener('ids', this.onIds)
    OneSignal.configure()
    OneSignal.setSubscription(true)
  }

  componentWillUnmount () {
    OneSignal.removeEventListener('ids', this.onIds)
  }

  findInitialRoute (u: ?User = null): Route {
    const user = u || (this.props.currentUser && this.props.users[this.props.currentUser])
    if (!user) return this.loadingRoute
    return user.laundries.length ? this.timetableRoute : this.qrRoute
  }

  refresh (users: Col<User>, currentUser?: string = '') {
    this.navigator.resetTo(this.findInitialRoute(users[currentUser]))
  }

  componentWillReceiveProps ({currentUser, users, laundries}: Props): void {
    if (!this.props.currentUser && currentUser) {
      return this.refresh(users, currentUser)
    }
    const user = this.user()
    if (!user || !currentUser) return
    if (user.laundries.length !== users[currentUser].laundries.length) {
      this.props.stateHandler.refresh()
      this.navigator.replace(this.loadingRoute)
    }
    if (this.findLaundries().length === this.findLaundries(users[currentUser], laundries).length) return
    this.refresh(users, currentUser)
  }

  findLaundries (user?: User, laundries?: Col<Laundry>): Laundry[] {
    const ls = laundries || this.props.laundries
    return (user || this.user() || {laundries: []}).laundries.map(id => ls[id]).filter(l => l)
  }

  loadingRoute = {title: '', id: 'loading', index: 0, hideBookings: true}

  timetableRoute = {title: 'general.timetable', id: 'timetable', index: 0}

  bookingListRoute = {
    title: 'general.yourbookings',
    id: 'bookingList',
    index: 1
  }

  settingsRoute = {
    title: 'general.settings',
    id: 'settings',
    index: 1
  }

  qrRoute = {
    index: 0,
    hideBookings: true,
    title: 'general.add.laundry',
    id: 'qr'
  }

  qrScannerRoute = {
    index: 1,
    title: 'general.qrcode',
    id: 'qr-scanner',
    hideBookings: true,
    sceneConfig: Navigator.SceneConfigs.FloatFromBottom
  }

  static renderTitle ({title}: Route) {
    if (!title) {
      return null
    }
    return <View style={loggedInApp.navBarContainer}>
      <Text style={loggedInApp.navBarTitle}>
        {title ? <FormattedMessage id={title}/> : ' '}
      </Text>
    </View>
  }

  renderSceneElement (id: string) {
    switch (id) {
      case 'loading':
        return <ActivityIndicator color={constants.darkTheme} size={'large'} style={loggedInApp.activityIndicator}/>
      case 'qr':
        return <QrCodeScanner onShowScanner={() => this.navigator.push(this.qrScannerRoute)}/>
      case 'settings':
        return <Settings
          stateHandler={this.props.stateHandler}
          laundry={this.laundry()}/>
      case 'bookingList':
        return <BookingList
          stateHandler={this.props.stateHandler}
          user={this.user()}
          laundry={this.laundry()}/>
      case 'timetable':
        return <Timetable
          stateHandler={this.props.stateHandler}
          user={this.user()}
          laundry={this.laundry()}/>
      case 'qr-scanner':
        return <QrCodeScannerCamera stateHandler={this.props.stateHandler}/>
      default:
        return null
    }
  }

  user (): ?User {
    return this.props.users[this.props.currentUser || '']
  }

  laundry (): ?Laundry {
    const user = this.user()
    return user && this.props.laundries[user.laundries[0]]
  }

  back () {
    this.navigator.pop()
  }

  renderScene ({id, index}: Route) {
    this.backAction = index > 0 ? () => this.back() : null
    return <View style={loggedInApp.mainContainer}>
      {this.renderSceneElement(id)}
    </View>
  }

  onPressBookingList () {
    // Checking if the booking list button has not already been clicked
    if (this.navigator.getCurrentRoutes().length < 2) {
      this.navigator.push(this.bookingListRoute)
    }
  }

  onPressSettings () {
    // Checking if the settings button has not already been clicked
    console.log(this.navigator.getCurrentRoutes())
    if (this.navigator.getCurrentRoutes().length < 2) {
      this.navigator.push(this.settingsRoute)
    }
  }

  renderRightButton ({index, hideBookings}: Route) {
    if (index > 0) return <View style={loggedInApp.navBarContainer}/>
    return <View style={loggedInApp.navBarContainer}>
      {hideBookings
        ? null
        : <TouchableOpacity onPress={() => this.onPressBookingList()}>
          <Image
            source={require('../../../img/list.png')}
            style={loggedInApp.navBarIcon}/>
        </TouchableOpacity>}
      <TouchableOpacity onPress={() => this.onPressSettings()}>
        <Image
          source={require('../../../img/gear.png')}
          style={loggedInApp.navBarIcon}/>
      </TouchableOpacity>
    </View>
  }

  renderLeftButton () {
    if (!this.backAction) {
      return null
    }
    return <View style={loggedInApp.navBarContainer}>
      <BackButton onPress={this.backAction}/>
    </View>
  }

  configureScene ({sceneConfig}: Route) {
    return sceneConfig || Navigator.SceneConfigs.PushFromRight
  }

  render () {
    return <Navigator
      configureScene={route => this.configureScene(route)}
      ref={navigator => { this.navigator = navigator }}
      initialRoute={this.findInitialRoute()}
      renderScene={(route, navigator) => this.renderScene(route, navigator)}
      navigationBar={<Navigator.NavigationBar
        routeMapper={{
          LeftButton: (route, navigator) => this.renderLeftButton(),
          Title: route => LoggedInApp.renderTitle(route),
          RightButton: (route, navigator) => this.renderRightButton(route)

        }}
        style={loggedInApp.navigationBar}
      />}
    />
  }
}

type BackButtonProps = {
  onPress: () => void
}
type BackButtonState = {
  opacity: number
}
class BackButton extends React.Component<void, BackButtonProps, BackButtonState> {
  props: BackButtonProps
  state = {opacity: 1}

  onPress () {
    this.props.onPress()
    this.setState({opacity: 0})
  }

  render () {
    return <TouchableOpacity onPress={() => this.onPress()}>
      <Fade duration={100} opacity={this.state.opacity}>
        <Image
          source={require('../../../img/back_240.png')}
          style={loggedInApp.navBarIcon}/>
      </Fade>
    </TouchableOpacity>
  }
}

