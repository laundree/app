/**
 * Created by soeholm on 05.02.17.
 */
'use strict';
import React, {Component} from 'react';
import {
    Alert,
    AppRegistry,
    Dimensions,
    Linking,
    StyleSheet,
    Text,
    TouchableHighlight,
    View
} from 'react-native';
import Camera from 'react-native-camera';

export default class QrCodeScanner extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}
                    onBarCodeRead={(event) => this.onBarCodeRead(event)}>
                </Camera>
            </View>
        );
    }

    onBarCodeRead(e) {
        console.log(
            "Barcode found",
            "Data: " + e.data
        );
        Alert.alert('Laundree invitation found!',
            'Do you want to open the Laundree in your browser?',
            [
                {
                    text: 'OK', onPress: () => {
                    console.log('OK pressed');
                    Linking.openURL(e.data).catch(err => console.error('An error occurred', err));
                }
                },
                {text: 'Cancel', onPress: () => console.log('Cancel pressed'), style: 'cancel'}
            ]);


    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        color: '#000',
        padding: 10,
        margin: 40
    }
});