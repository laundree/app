// @flow

/**
 * Exports a FancyButton with
 * an Image
 */

import React from 'react'
import { View, Image } from 'react-native'
import FancyButton from './FancyButton'
import { fancyImageButton } from '../../../style'

type FancyImageButtonProps = { onPress: Function, disabled?: boolean, imageSource: number, style?: Object | Object[] }

const FancyImageButton = ({onPress, disabled, imageSource, style}: FancyImageButtonProps) => <FancyButton
  onPress={onPress} disabled={disabled} style={[fancyImageButton.button, style]}>
  <View style={fancyImageButton.view}>
    <Image style={fancyImageButton.image} source={imageSource}/>
  </View>
</FancyButton>

export default FancyImageButton
