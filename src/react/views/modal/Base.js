/**
 * Created by budde on 26/03/2017.
 */
import React from 'react'
import { modal } from '../../../style'
import {
  View,
  Modal
} from 'react-native'

const Base = ({children, visible, onRequestClose}) => (
  <Modal visible={visible} transparent onRequestClose={onRequestClose || (() => {})}>
    <View style={modal.base}>
      <View style={modal.window}>
        {children}
      </View>
    </View>
  </Modal>)

Base.propTypes = {
  onRequestClose: Modal.propTypes.onRequestClose,
  visible: React.PropTypes.bool,
  children: React.PropTypes.any
}

export default Base
