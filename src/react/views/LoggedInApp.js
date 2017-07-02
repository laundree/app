// @flow

import React from 'react'
import { StackNavigator, NavigationActions } from 'react-navigation'
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import Timetable from '../containers/Timetable'
import Settings from './../containers/Settings'
import BookingList from '../containers/BookingList'
import QrCodeScanner from './QrCodeScanner'
import QrCodeScannerCamera from './QrCodeScannerCamera'
import { loggedInApp, constants } from '../../style'
import OneSignal from 'react-native-onesignal'
import type { User, Laundry } from 'laundree-sdk/lib/redux'
import { FormattedMessage } from 'react-intl'

type Col<X> = { [string]: X }

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
  sceneConfig?: *
}

class Screen extends React.Component {
  Element: *
  redirecting = false

  isLoading () {
    return false
  }

  check (user) {
    return null
  }

  checkRedirect (user) {
    const route = this.check(user)
    if (!route) {
      return
    }
    if (route === this.props.navigation.state.routeName) {
      return
    }
    if (this.redirecting) {
      return
    }
    this.redirecting = true
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: route})
      ]
    }))
  }

  componentDidMount () {
    this.checkRedirect(this.props.screenProps.user)
  }

  componentWillReceiveProps (props) {
    if (props.screenProps.user === this.props.screenProps.user) {
      return
    }
    this.checkRedirect(props.screenProps.user)
  }

  render () {
    const {user, laundry, stateHandler} = this.props.screenProps
    if (this.isLoading()) {
      return (
        <View style={loggedInApp.mainContainer}>
          <ActivityIndicator color={constants.darkTheme} size={'large'} style={loggedInApp.activityIndicator}/>
        </View>
      )
    }
    return (
      <View style={loggedInApp.mainContainer}>
        <this.Element
          user={user}
          laundry={laundry}
          stateHandler={stateHandler}
          onShowScanner={() => this.props.navigation.dispatch(NavigationActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({routeName: 'QrCodeScanner'}),
              NavigationActions.navigate({routeName: 'QrCodeScannerCamera'})
            ]
          }))}
        />
      </View>
    )
  }
}

class TimetableScreen extends Screen {
  Element = Timetable

  static navigationOptions = {
    headerTitle: (
      <View style={loggedInApp.navBarContainer}>
        <Text style={loggedInApp.navBarTitle}><FormattedMessage id='general.timetable'/></Text>
      </View>
    )
  }

  componentDidMount () {
    super.componentDidMount()
    this.props.screenProps.stateHandler.sdk.listLaundries()
  }

  check (user) {
    return user && user.laundries.length === 0 && 'QrCodeScanner'
  }

  isLoading () {
    return !(this.props.screenProps.user && this.props.screenProps.laundry)
  }
}

class SettingsScreen extends Screen {
  Element = Settings

  static navigationOptions = {
    headerTitle: (
      <View style={loggedInApp.navBarContainer}>
        <Text style={loggedInApp.navBarTitle}><FormattedMessage id='general.settings'/></Text>
      </View>
    )
  }
}

class BookingsScreen extends Screen {
  Element = BookingList

  static navigationOptions = {
    headerTitle: (
      <View style={loggedInApp.navBarContainer}>
        <Text style={loggedInApp.navBarTitle}><FormattedMessage id='general.yourbookings'/></Text>
      </View>
    )
  }

  check (user) {
    return user && user.laundries.length === 0 && 'QrCodeScanner'
  }

  isLoading () {
    return !(this.props.screenProps.user && this.props.screenProps.laundry)
  }
}

class QrCodeScannerScreen extends Screen {
  static navigationOptions = {
    headerTitle: (
      <View style={loggedInApp.navBarContainer}>
        <Text style={loggedInApp.navBarTitle}><FormattedMessage id='general.add.laundry'/></Text>
      </View>
    )
  }

  check (user) {
    return user && user.laundries.length > 0 && 'Timetable'
  }

  Element = QrCodeScanner

  isLoading () {
    return !this.props.screenProps.user
  }
}

class QrCodeScannerCameraScreen extends Screen {
  static navigationOptions = {
    headerTitle: (
      <View style={loggedInApp.navBarContainer}>
        <Text style={loggedInApp.navBarTitle}><FormattedMessage id='general.qrcode'/></Text>
      </View>
    )
  }

  check (user) {
    return user && user.laundries.length > 0 && 'Timetable'
  }

  Element = QrCodeScannerCamera

  isLoading () {
    return !this.props.screenProps.user
  }
}

class NoopScreen extends Screen {
  Element = () => null

  isLoading () {
    return true
  }

  check (user) {
    return user && ((user.laundries.length === 0 && 'QrCodeScanner') || 'Timetable')
  }
}

function renderRightButton (navigation, user) {
  if (navigation.state.routeName !== 'Timetable' && navigation.state.routeName !== 'QrCodeScanner') {
    return null
  }
  const bookingsView = <TouchableOpacity
    onPress={() => navigation.dispatch(NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({routeName: navigation.state.routeName}),
        NavigationActions.navigate({routeName: 'Bookings'})
      ]
    }))}>
    <Image
      source={require('../../../img/list.png')}
      style={loggedInApp.navBarIcon}/>
  </TouchableOpacity>
  return <View style={loggedInApp.navBarContainer}>
    {(user && user.laundries.length > 0 && bookingsView) || null}
    <TouchableOpacity onPress={() => navigation.dispatch(NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({routeName: navigation.state.routeName}),
        NavigationActions.navigate({routeName: 'Settings'})
      ]
    }))}>
      <Image
        source={require('../../../img/gear.png')}
        style={loggedInApp.navBarIcon}/>
    </TouchableOpacity>
  </View>
}

const Stack = StackNavigator({
  Noop: {screen: NoopScreen},
  Timetable: {screen: TimetableScreen},
  Settings: {screen: SettingsScreen},
  Bookings: {screen: BookingsScreen},
  QrCodeScanner: {screen: QrCodeScannerScreen},
  QrCodeScannerCamera: {screen: QrCodeScannerCameraScreen}
}, {
  navigationOptions: ({navigation, screenProps}) => ({
    headerStyle: loggedInApp.navBar,
    headerTitleStyle: loggedInApp.navBarTitle,
    headerTintColor: '#fff',
    headerRight: renderRightButton(navigation, screenProps.user)
  })
})

export default class LoggedInApp extends React.Component {
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

  user (): ?User {
    return this.props.users[this.props.currentUser || '']
  }

  laundry (): ?Laundry {
    const user = this.user()
    return user && this.props.laundries[user.laundries[0]]
  }

  render () {
    return (
      <Stack
        screenProps={{user: this.user(), laundry: this.laundry(), stateHandler: this.props.stateHandler}}/>
    )
  }
}
