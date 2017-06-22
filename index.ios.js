/**
 * React Native App for Laundree
 *
 * https://laundree.io/
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react'
import {AppRegistry} from 'react-native'
import App from './src/react/views/App'

const Laundree = () => <App/>

AppRegistry.registerComponent('Laundree', () => Laundree)
