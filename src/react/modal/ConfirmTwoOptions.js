// @flow

import React from 'react'
import FancyTextButton from '../input/FancyTextButton'
import { modal } from '../../style'
import {
  Text,
  View
} from 'react-native'
import Base from './Base'
import { FormattedMessage } from 'react-intl'

type Props = {
  id: string,
  onConfirm: Function,
  onConfirmSlot: Function,
  onCancel: Function,
  visible?: boolean
}

const ConfirmTwoOptions = ({id, visible, onCancel, onConfirm, onConfirmSlot}: Props) => (
  <Base visible={visible} onRequestClose={onCancel}>
    <View style={modal.title}>
      <Text style={modal.titleText}>
        <FormattedMessage id={id} />
      </Text>
    </View>
    <View style={modal.buttonContainer}>
      <View style={modal.button}>
        <FancyTextButton
          style={modal.redButton} id='general.cancel'
          onPress={onCancel} />
      </View>
      <View style={modal.button}>
        <FancyTextButton
          id='general.confirm.delete'
          onPress={onConfirm} />
      </View>
      <View style={modal.button}>
        <FancyTextButton
          id='general.confirm.delete.slot'
          onPress={onConfirmSlot}
          visible={false} />
      </View>
    </View>
  </Base>)

export default ConfirmTwoOptions
