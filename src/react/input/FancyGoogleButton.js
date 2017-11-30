// @flow

import React from 'react'
import FancyImageTextButton from './FancyImageTextButton'
import { fancyGoogleButton } from '../../style'

const FancyGoogleButton = ({id, onPress, disabled}: { id: string, onPress: Function, disabled?: boolean }) => (
  <FancyImageTextButton
    style={fancyGoogleButton.button}
    onPress={onPress}
    disabled={disabled}
    id={id}
    imageSource={require('../../../img/google.png')} />)

export default FancyGoogleButton
