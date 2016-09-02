/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';

import Bluetooth from './PrinterUtils/Bluetooth';

class PrinterSample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
    }

    componentWillMount() {

        Bluetooth.isSupport((result)=> {
            if (result) {
                this.setState({
                    text: "支持蓝牙"
                })
            } else {
                this.setState({
                    text: "该机不支持蓝牙"
                })
            }
        });
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Welcome to React Native!
                </Text>
                <Text style={styles.instructions}>
                    To get started, edit index.android.js
                </Text>
                <Text style={styles.instructions}>
                    {this.state.text}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('PrinterSample', () => PrinterSample);
