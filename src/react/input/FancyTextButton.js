// @flow

/**
 * Exports a FancyButton with Text
 */

import React from 'react'
import { Text } from 'react-native'
import FancyButton from './FancyButton'
import { fancyTextButton } from '../../style'
import { FormattedMessage } from 'react-intl'

type FancyTextButtonProps = { id: string, onPress: Function, disabled?: boolean, style?: number }

const FancyTextButton = ({id, onPress, disabled, style}: FancyTextButtonProps) => (
  <FancyButton
    style={style} onPress={onPress}
    disabled={disabled}>
    <Text style={[fancyTextButton.text, disabled ? fancyTextButton.disabled : fancyTextButton.enabled]}>
      <FormattedMessage id={id} />
    </Text>
  </FancyButton>)

export default FancyTextButton
