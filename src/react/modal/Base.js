// @flow
import React from 'react'
import { modal } from '../../style'
import {
  View,
  Modal
} from 'react-native'

type BaseProps = {
  onRequestClose: Function,
  visible?: boolean,
  children: *

}

const Base = ({children, visible, onRequestClose}: BaseProps) => (
  <Modal visible={visible} transparent onRequestClose={onRequestClose || (() => {})}>
    <View style={modal.base}>
      <View style={modal.window}>
        {children}
      </View>
    </View>
  </Modal>)

export default Base
