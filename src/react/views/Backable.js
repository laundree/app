/**
 * Created by budde on 26/02/2017.
 */
import React from 'react'
import { BackAndroid } from 'react-native'

export default class Backable extends React.Component {
  listener = () => {
    if (!this.backAction) return false
    this.backAction()
    return true
  }

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this.listener)
  }

  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this.listener)
  }
}