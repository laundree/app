/**
 * Created by soeholm on 05.02.17.
 */

import React from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class Timetable extends React.Component {
    render() {
        return <View style={styles.container}>
            <Text style={styles.login}>
                Haha you cannot see the timetable yet
            </Text>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    login: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});