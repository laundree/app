/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
'use strict';
import React from 'react';
import {AppRegistry} from 'react-native';
import MainRouter from './src/MainRouter'

const LaundreeApp = () => <MainRouter/>

AppRegistry.registerComponent('LaundreeApp', () => LaundreeApp);
