// @flow
import React from 'react'
import { BackAndroid } from 'react-native'

export default class Backable<P, S> extends React.Component<void, P, S> {
  props: P
  state: S
  backAction: ?(() => void)

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
