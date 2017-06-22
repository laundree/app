// @flow

/**
 * Exports a button that can be
 * enabled and disabled
 */

import React from 'react'
import { TouchableHighlight, View } from 'react-native'
import { fancyButton } from '../../../style'
import type { Children } from 'react'

type FancyButtonProps = { children: Children, onPress: Function, style: Object | Object[], disabled: boolean }

export default class FancyButton extends React.Component <*, FancyButtonProps, *> {

  render () {
    return <TouchableHighlight disabled={this.props.disabled} onPress={this.props.onPress}>
      <View style={[fancyButton.buttonView, this.props.disabled ? fancyButton.disabledView : fancyButton.enabledView, this.props.style]}>
            {this.props.children}
      </View>
      </TouchableHighlight>
  }

}
