/**
 * Created by soeholm on 05.02.17.
 */
'use strict';
import React, {Component} from 'react';
import {
    Alert,
    AppRegistry,
    Dimensions,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View
} from 'react-native';
import Camera from 'react-native-camera';

export default class QrCodeScanner extends Component {

    constructor(props) {
        super(props);
        this.state = {showQr: false};
    }

    render() {
        if (this.state.showQr) {
            return <QrCamera/>
        }
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    Press the button to start scanning the QR code for the laundry
                </Text>
                <TouchableOpacity onPress={(event) => this.onPress(event)}>
                    <Image source={require('../img/qrcode_240.png')}/>
                </TouchableOpacity>
                <Text style={styles.message}>
                    Or ask the admin to add your {'\n'}
                    e-mail address
                </Text>
                <Text style={styles.message}>
                    Happy washing!
                </Text>
            </View>
        );
    }

    onPress(e) {
        console.log("Pressed QR code scanner button");
        this.setState({showQr: true});
    }
}

class QrCamera extends Component {

    constructor(props) {
        super(props);
        this.state = {showQr: true};
    }

    render() {
        if (!this.state.showQr) {
            return <QrCodeScanner/>
        }
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    Press the button to start scanning the QR code for the laundry
                </Text>
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.scanner}
                    aspect={Camera.constants.Aspect.fill}
                    onBarCodeRead={(event) => this.onBarCodeRead(event)}>
                </Camera>
                <Text style={styles.message}>
                    Or ask the admin to add your {'\n'}
                    e-mail address
                </Text>
                <TouchableHighlight onPress={(event) => this.onPress(event)}>
                    <Text style={styles.message}>
                        Navigate back
                    </Text>
                </TouchableHighlight>
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

    onPress(e) {
        console.log("Pressed Navigate back");
        this.setState({showQr: false});
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#66D3D3'
    },
    message: {
        fontSize: 20,
        color: '#03414C',
        margin: 50,
        textAlign: 'center'
    },
    cameraview: {
        height: Dimensions.get('window').width,
        width: Dimensions.get('window').width,
        margin: 50,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#03414C'
    },
    scanner: {
        //flex: 1,
        //justifyContent: 'flex-end',
        //alignItems: 'center',
        height: 240,
        width: 240
    }
});