import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'
import { FormattedMessage } from 'react-intl'

import { offline } from '../../style'

export default class OfflineApp extends React.Component {

  render () {
    return <View style={offline.mainContainer}>
      <View style={offline.smiley}>
        <Image
          style={offline.smileyImage}
          source={require('../../../img/dead_smiley_dark_blue.png')}/>
      </View>
      <View style={offline.offlineView}>
        <Text style={offline.headerText}>
          <FormattedMessage id='offline.title'/>
        </Text>
        <Text style={offline.message}>
          <FormattedMessage id='offline.message'/>
        </Text>
      </View>
    </View>
  }

}
