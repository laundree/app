// @flow

/**
 * Exports a button that can be
 * enabled and disabled
 */

import React from 'react'
import { TouchableHighlight, View } from 'react-native'
import { fancyButton } from '../../style'

type FancyButtonProps = { children: *, onPress: Function, style?: *, disabled?: boolean }

export default class FancyButton extends React.PureComponent <FancyButtonProps> {
  render () {
    return <TouchableHighlight disabled={this.props.disabled} onPress={this.props.onPress}>
      <View style={[fancyButton.buttonView, this.props.disabled ? fancyButton.disabledView : fancyButton.enabledView, this.props.style]}>
        {this.props.children}
      </View>
    </TouchableHighlight>
  }
}
