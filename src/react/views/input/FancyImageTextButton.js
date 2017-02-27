/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import FancyButton from './FancyButton'

const FancyImageTextButton = ({text, onPress, disabled, imageSource, style}) => <FancyButton
  onPress={onPress} disabled={disabled} style={[styleSheet.button, style]}>
  <View style={styleSheet.view}>
    <Image style={styleSheet.image} source={imageSource}/>
    <Text style={styleSheet.text}>
      {text}
    </Text>
  </View>
</FancyButton>

export default FancyImageTextButton

const styleSheet = StyleSheet.create({
  button: {
    backgroundColor: '#7d3362'
  },
  view: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  image: {
    height: 20,
    width: 20,
    margin: 10,
    marginRight: 15,
    marginLeft: 15
  },
  text: {
    color: '#fff'
  },
  enabled: {
    color: '#fff'
  },
  disabled: {
    color: '#e2e2e2'
  }
})

FancyImageTextButton.propTypes = {
  imageSource: Image.propTypes.source,
  style: FancyButton.propTypes.style,
  text: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
}

