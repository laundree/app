// @flow

/**
 * Exports a FancyButton with
 * Image and Text
 */

import React from 'react'
import { Text, View, Image } from 'react-native'
import FancyButton from './FancyButton'
import { fancyImageTextButton } from '../../../style'
import { FormattedMessage } from 'react-intl'

type FancyImageTextButtonProps = { id: string, onPress: Function, disabled?: boolean, imageSource: number, style?: * }

const FancyImageTextButton = ({id, onPress, disabled, imageSource, style}: FancyImageTextButtonProps) => <FancyButton
  onPress={onPress} disabled={disabled} style={[fancyImageTextButton.button, style]}>
  <View style={fancyImageTextButton.view}>
    <Image style={fancyImageTextButton.image} source={imageSource} />
    <Text style={fancyImageTextButton.text}>
      <FormattedMessage id={id} />
    </Text>
  </View>
</FancyButton>

export default FancyImageTextButton
