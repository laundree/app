/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { Text, View, Image } from 'react-native'
import FancyButton from './FancyButton'
import { fancyImageTextButton } from '../../../style'

const FancyImageTextButton = ({text, onPress, disabled, imageSource, style}) => <FancyButton
  onPress={onPress} disabled={disabled} style={[fancyImageTextButton.button, style]}>
  <View style={fancyImageTextButton.view}>
    <Image style={fancyImageTextButton.image} source={imageSource}/>
    <Text style={fancyImageTextButton.text}>
      {text}
    </Text>
  </View>
</FancyButton>

export default FancyImageTextButton

FancyImageTextButton.propTypes = {
  imageSource: Image.propTypes.source,
  style: FancyButton.propTypes.style,
  text: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

