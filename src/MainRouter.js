/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react';
import QrCodeScanner from './QrCodeScanner'
import Login from './Login'
import Timetable from './Timetable'

export default class MainRouter extends React.Component {
    render () {
        switch (Math.floor(Math.random() * 3)) {
            case 0: return <QrCodeScanner/>
            case 1: return <Login/>
            case 2: return <Timetable/>
        }
        return null;
    }
}