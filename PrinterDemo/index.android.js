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
    View,
    TouchableOpacity,
    Alert,
    ListView,
    DeviceEventEmitter,
    Navigator,
    BackAndroid,
} from 'react-native';
import BTSearch from "./BTSearchComponent";
import BTPrint from "./BTPrintComponent";

class PrinterDemo extends Component {
    configureScene(route) {
        return Navigator.SceneConfigs.PushFromRight;
    }

    renderScene(router, navigator) {
        var Component = router.component;
        _navigator = navigator;
        switch (router.name) {
            case "search":
                Component = BTSearch;
                break;
            case "print":
                Component = BTPrint;
                break;
            default:
                Component = BTSearch;
                break;
        }
        return <View style={{flex: 1}}>
            <Component {...router.params} navigator={navigator}/>
        </View>
    }

    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', function () {
            if (_navigator && _navigator.getCurrentRoutes().length > 1) {
                _navigator.pop();
                return true;
            }
            return false;
        });
    }

    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress');
    }

    render() {
        return (
            <Navigator
                initialRoute={{name: 'search'}}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
            />
        );
    }
}


AppRegistry.registerComponent('PrinterDemo', () => PrinterDemo);
