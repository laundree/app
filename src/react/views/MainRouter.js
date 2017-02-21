/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react'
import Login from './Login'
import Timetable from './Timetable'
import Settings from './Settings'
import fetchStateHandler from '../../stateHandler'
import { View, Text, StyleSheet, Navigator, Image, TouchableHighlight } from 'react-native'

export default class MainRouter extends React.Component {

  constructor (props) {
    super(props)
    this.state = {loading: true, sesh: 0}
  }

  componentDidMount () {
    fetchStateHandler().then(stateHandler => {
      this._stateHandler = stateHandler
      this._stateHandler.on('authChange', () => this.setState(({sesh}) => ({sesh: sesh + 1})))
      this.setState({loading: false})
    })
  }

  get initialRoute () {
    return this.timetableRoute
  }

  renderTitle ({title}) {
    return <View style={styles.navBarContainer}>
      <Text style={styles.navBarTitle}>{title}</Text>
    </View>
  }

  renderScene ({element}) {
    return <View style={styles.mainContainer}>
      {element}
    </View>
  }

  get timetableRoute () {
    return {title: 'Timetable', element: <Timetable/>, index: 0}
  }

  renderLogin () {
    return <Login stateHandler={this._stateHandler}/>
  }

  get settingsRoute () {
    return {
      title: 'Settings',
      element: <Settings stateHandler={this._stateHandler}/>,
      index: 1
    }
  }

  renderRightButton ({index}, navigator) {
    if (index > 0) return null
    return <View style={styles.navBarContainer}>
      <TouchableHighlight onPress={() => navigator.push(this.settingsRoute)}>
        <Image
          source={require('../../../img/gear.png')}
          style={styles.navBarIcon}/>
      </TouchableHighlight>
    </View>
  }

  renderLeftButton ({index}, navigator) {
    if (index === 0) return null
    return <View style={styles.navBarContainer}>
      <TouchableHighlight onPress={() => navigator.pop()}>
        <Image
          source={require('../../../img/back.png')}
          style={styles.navBarIcon}/>
      </TouchableHighlight>
    </View>
  }

  renderContent () {
    if (this.state.loading) return null
    if (!this._stateHandler.isAuthenticated) {
      return this.renderLogin()
    }
    return <Navigator
      initialRoute={this.initialRoute}
      renderScene={route => this.renderScene(route)}
      navigationBar={<Navigator.NavigationBar
        routeMapper={{
          LeftButton: (route, navigator) => this.renderLeftButton(route, navigator),
          Title: route => this.renderTitle(route),
          RightButton: (route, navigator) => this.renderRightButton(route, navigator)

        }}
        style={{backgroundColor: '#E55564'}}
      />}
    />
  }

  render () {
    return <View style={styles.mainContainer}>{this.renderContent()}</View>
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#66d3d3',
    flex: 1
  },
  navBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
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

