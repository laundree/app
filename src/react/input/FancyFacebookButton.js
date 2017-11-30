// @flow

/**
 * Created by budde on 25/02/2017.
 */
import React from 'react'
import FancyImageTextButton from './FancyImageTextButton'
import { fancyFacebookButton } from '../../style'

const FancyFacebookButton = ({id, onPress, disabled}: { id: string, onPress: Function, disabled?: boolean }) => (
  <FancyImageTextButton
    style={fancyFacebookButton.button}
    onPress={onPress}
    id={id}
    disabled={disabled}
    imageSource={require('../../../img/facebook.png')}/>)

export default FancyFacebookButton
