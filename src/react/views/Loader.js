// @flow
import React from 'react'
import {
  View,
  ActivityIndicator
} from 'react-native'
import { loader, constants } from '../../style'

export default class Loader extends React.Component {
  props: { loader: () => Promise<*>, children?: React.Element<*>, style?: {} }
  state: { loaded: boolean } = {loaded: false}

  componentDidMount () {
    this.props.loader().then(() => this.setState({loaded: true}))
  }

  render () {
    return <View style={this.props.style}>
      {
        this.state.loaded
          ? this.props.children
          : <ActivityIndicator color={constants.darkTheme} size={'large'} style={loader.activityIndicator} />
      }
    </View>
  }
}
