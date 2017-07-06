// @flow

/**
 * Exports a FancyImageTextButton
 * customised for e-mail
 */

import React from 'react'
import FancyImageTextButton from './FancyImageTextButton'

type FancyEmailButtonProps = { id: string, onPress: Function, disabled?: boolean }

const FancyEmailButton = ({ id, onPress, disabled }: FancyEmailButtonProps) => <FancyImageTextButton
  style={FancyEmailButton.button}
  onPress={onPress}
  id={id}
  disabled={disabled}
  imageSource={require('../../../../img/email.png')} />

export default FancyEmailButton
