/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { View, Text, StyleSheet, Navigator, Image, TouchableOpacity } from 'react-native'
import Timetable from './Timetable'
import Settings from './../containers/Settings'
import QrCodeScanner from './QrCodeScanner'
import QrCodeScannerCamera from './QrCodeScannerCamera'
import Backable from './Backable'
import constants from '../../constants'

export default class LoggedInApp extends Backable {

  findInitialRoute (u = null) {
    const user = u || this.props.users[this.props.currentUser]
    if (!user) return {title: 'Loading', element: null, index: 0}
    return user.laundries.length ? this.timetableRoute : this.qrRoute
  }

  refresh (users, currentUser) {
    this.navigator.replace(this.findInitialRoute(users[currentUser]))
  }

  componentWillReceiveProps ({currentUser, users}) {
    if (!this.props.currentUser && currentUser) return this.refresh(users, currentUser)
    if (!currentUser || this.props.users[this.props.currentUser].laundries.length === users[currentUser].laundries.length) {
      return
    }
    this.refresh(users, currentUser)
  }

  get timetableRoute () {
    return {title: 'Timetable', id: 'timetable', index: 0}
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
    return <View style={styles.navBarContainer}>
      <Text style={styles.navBarTitle}>{title}</Text>
    </View>
  }

  renderSceneElement (id, navigator) {
    switch (id) {
      case 'qr':
        return <QrCodeScanner onShowScanner={() => navigator.push(this.qrScannerRoute)}/>
      case 'settings':
        return <Settings stateHandler={this.props.stateHandler}/>
      case 'timetable':
        return <Timetable/>
      case 'qr-scanner':
        return <QrCodeScannerCamera stateHandler={this.props.stateHandler}/>
      default:
        return null
    }
  }

  renderScene ({id, index}, navigator) {
    this.backAction = index > 0 ? () => navigator.pop() : null

    return <View style={styles.mainContainer}>
      {this.renderSceneElement(id, navigator)}
    </View>
  }

  renderRightButton ({index}, navigator) {
    if (index > 0) return <View style={styles.navBarContainer}/>
    return <View style={styles.navBarContainer}>
      <TouchableOpacity onPress={() => navigator.push(this.settingsRoute)}>
        <Image
          source={require('../../../img/gear.png')}
          style={styles.navBarIcon}/>
      </TouchableOpacity>
    </View>
  }

  renderLeftButton (_, navigator) {
    if (!this.backAction) return <View style={styles.navBarContainer}/>
    return <View style={styles.navBarContainer}>
      <TouchableOpacity onPress={this.backAction}>
        <Image
          source={require('../../../img/back.png')}
          style={styles.navBarIcon}/>
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
        style={styles.navigationBar}
      />}
    />
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: constants.appBackgroundColor,
    flex: 1,
    paddingTop: Navigator.NavigationBar.Styles.General.NavBarHeight + constants.statusBarHeight

  },
  navigationBar: {
    backgroundColor: constants.colorRed
  },
  navBarContainer: {
    backgroundColor: constants.colorRed,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minWidth: 40
  },
  navBarTitle: {
    fontSize: 20,
    color: '#fff'
  },
  navBarIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginLeft: 10
  },
  content: {
    borderWidth: 1
  }
})

LoggedInApp.propTypes = {
  currentUser: React.PropTypes.string,
  users: React.PropTypes.object,
  stateHandler: React.PropTypes.object.isRequired
}
