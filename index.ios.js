/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react'
import {AppRegistry} from 'react-native'
import MainRouter from './src/react/views/MainRouter'

const LaundreeApp = () => <MainRouter/>

AppRegistry.registerComponent('LaundreeApp', () => LaundreeApp)
