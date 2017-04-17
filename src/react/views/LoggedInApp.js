/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { View, Text, Navigator, Image, TouchableOpacity } from 'react-native'
import Timetable from '../containers/Timetable'
import Settings from './../containers/Settings'
import BookingList from '../containers/BookingList'
import QrCodeScanner from './QrCodeScanner'
import QrCodeScannerCamera from './QrCodeScannerCamera'
import Backable from './Backable'
import { loggedInApp } from '../../style'

export default class LoggedInApp extends Backable {

  findInitialRoute (u = null) {
    const user = u || this.props.users[this.props.currentUser]
    if (!user) return this.loadingRoute
    return user.laundries.length ? this.timetableRoute : this.qrRoute
  }

  refresh (users, currentUser) {
    this.navigator.replace(this.findInitialRoute(users[currentUser]))
  }

  componentWillReceiveProps ({currentUser, users, laundries}) {
    if (!this.props.currentUser && currentUser) return this.refresh(users, currentUser)
    if (!currentUser) return
    if (this.props.users[this.props.currentUser].laundries.length !== users[currentUser].laundries.length) {
      this.props.stateHandler.refresh()
      this.navigator.replace(this.loadingRoute)
    }
    if (this.findLaundries().length === this.findLaundries(users[currentUser], laundries).length) return
    this.refresh(users, currentUser)
  }

  findLaundries (user = this.user, laundries = this.props.laundries) {
    return user.laundries.map(id => laundries[id]).filter(l => l)
  }

  get loadingRoute () {
    return {title: 'Loading', element: null, index: 0}
  }
  get timetableRoute () {
    return {title: 'Timetable', id: 'timetable', index: 0}
  }

  get bookingListRoute () {
    return {
      title: 'Your bookings',
      id: 'bookingList',
      index: 1
    }
  }

  get settingsRoute () {
    return {
      title: 'Settings',
      id: 'settings',
      index: 1
    }
  }

  get qrRoute () {
    return {
      index: 0,
      title: 'Add laundry',
      id: 'qr'
    }
  }

  get qrScannerRoute () {
    return {
      index: 1,
      title: 'Scan QR code',
      id: 'qr-scanner',
      sceneConfig: Navigator.SceneConfigs.FloatFromBottom
    }
  }

  renderTitle ({title}) {
    return <View style={loggedInApp.navBarContainer}>
      <Text style={loggedInApp.navBarTitle}>{title}</Text>
    </View>
  }

  renderSceneElement (id, navigator) {
    switch (id) {
      case 'qr':
        return <QrCodeScanner onShowScanner={() => navigator.push(this.qrScannerRoute)}/>
      case 'settings':
        return <Settings stateHandler={this.props.stateHandler}
          laundry={this.laundry}/>
      case 'bookingList':
        return <BookingList stateHandler={this.props.stateHandler}
          user={this.user}
          laundry={this.laundry}/>
      case 'timetable':
        return <Timetable stateHandler={this.props.stateHandler}
          user={this.user}
          laundry={this.laundry}/>
      case 'qr-scanner':
        return <QrCodeScannerCamera stateHandler={this.props.stateHandler}/>
      default:
        return null
    }
  }

  get user () {
    return this.props.users[this.props.currentUser]
  }

  get laundry () {
    console.log('Laundries in LoggedInApp: ' + this.props.laundries)
    console.log(this.user.laundries[0])
    console.log(this.props.laundries[this.user.laundries[0]])
    return this.props.laundries[this.user.laundries[0]]
  }

  renderScene ({id, index}, navigator) {
    this.backAction = index > 0 ? () => navigator.pop() : null

    return <View style={loggedInApp.mainContainer}>
      {this.renderSceneElement(id, navigator)}
    </View>
  }

  onPressBookingList (navigator) {
    // Checking if the booking list button has not already been clicked
    if (navigator.getCurrentRoutes().length < 2) {
      navigator.push(this.bookingListRoute)
    }
  }

  onPressSettings (navigator) {
    // Checking if the settings button has not already been clicked
    if (navigator.getCurrentRoutes().length < 2) {
      navigator.push(this.settingsRoute)
    }
  }

  // TODO if the user has no bookings, then perhaps the button for Booking List should not be displayed?
  renderRightButton ({index}, navigator) {
    if (index > 0) return <View style={loggedInApp.navBarContainer}/>
    return <View style={loggedInApp.navBarContainer}>
      <TouchableOpacity onPress={() => this.onPressBookingList(navigator)}>
        <Image
          source={require('../../../img/list.png')}
          style={loggedInApp.navBarIcon}/>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.onPressSettings(navigator)}>
        <Image
          source={require('../../../img/gear.png')}
          style={loggedInApp.navBarIcon}/>
      </TouchableOpacity>
    </View>
  }

  renderLeftButton (_, navigator) {
    if (!this.backAction) return <View style={loggedInApp.navBarContainer}/>
    return <View style={loggedInApp.navBarContainer}>
      <TouchableOpacity onPress={this.backAction}>
        <Image
          source={require('../../../img/back_240.png')}
          style={loggedInApp.navBarIcon}/>
      </TouchableOpacity>
    </View>
  }

  configureScene ({sceneConfig}, routeStack) {
    return sceneConfig || Navigator.SceneConfigs.PushFromRight
  }

  render () {
    return <Navigator
      configureScene={(route, routeStack) => this.configureScene(route, routeStack)}
      ref={navigator => { this.navigator = navigator }}
      initialRoute={this.findInitialRoute()}
      renderScene={(route, navigator) => this.renderScene(route, navigator)}
      navigationBar={<Navigator.NavigationBar
        routeMapper={{
          LeftButton: (route, navigator) => this.renderLeftButton(route, navigator),
          Title: route => this.renderTitle(route),
          RightButton: (route, navigator) => this.renderRightButton(route, navigator)

        }}
        style={loggedInApp.navigationBar}
      />}
    />
  }
}

LoggedInApp.propTypes = {
  currentUser: React.PropTypes.string,
  users: React.PropTypes.object,
  laundries: React.PropTypes.object,
  stateHandler: React.PropTypes.object.isRequired
}
