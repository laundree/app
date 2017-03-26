/**
 * Created by soeholm on 26.03.17.
 */
import React from 'react'
import { View, Image } from 'react-native'
import FancyButton from './FancyButton'
import { fancyImageButton } from '../../../style'

const FancyImageButton = ({onPress, disabled, imageSource, style}) => <FancyButton
  onPress={onPress} disabled={disabled} style={[fancyImageButton.button, style]}>
  <View style={fancyImageButton.view}>
    <Image style={fancyImageButton.image} source={imageSource}/>
  </View>
</FancyButton>

export default FancyImageButton

FancyImageButton.propTypes = {
  imageSource: Image.propTypes.source,
  style: FancyButton.propTypes.style,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

