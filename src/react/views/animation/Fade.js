// @flow
import React from 'react'
import { Animated } from 'react-native'

type Props = {
  children?: Element<any>,
  duration?: number,
  opacity?: number
}

type State = {
  opacity: Animated.Value
}

export default class Fade extends React.Component {
  props: Props
  state: State = {opacity: new Animated.Value(0)}
  defaultDuration = 1000
  animation: { start: () => void, stop: () => void }

  componentDidMount () {
    this.animation = Animated
      .timing(this.state.opacity, {
        toValue: this.findOpacity(this.props.opacity),
        duration: this.props.duration || this.defaultDuration
      })
    this.animation.start()
  }

  findOpacity (opacity?: number) {
    return opacity === undefined
      ? 1
      : opacity
  }

  componentWillReceiveProps ({opacity, duration}: Props) {
    if (opacity === this.props.opacity) {
      return
    }
    this.animation.stop()
    this.animation = Animated.timing(this.state.opacity, {
      toValue: this.findOpacity(opacity),
      duration: duration || this.defaultDuration
    })
    this.animation.start()
  }

  render () {
    return <Animated.View style={{opacity: this.state.opacity}}>
      {this.props.children}
    </Animated.View>
  }
}
