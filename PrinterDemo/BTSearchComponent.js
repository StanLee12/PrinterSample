/**
 * Created by Stan on 16/9/14.
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
} from 'react-native';
import Bluetooth from './Bluetooth';
import CodePush from 'react-native-code-push';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 != r2});


class BTSearchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: ds.cloneWithRows([]),
        }
    }

    componentWillUnmount() {
        Bluetooth.disConnect();
        CodePush.disallowRestart();
    }

    componentWillUnmount() {
        // Reallow restarts, and optionally trigger
        // a restart if one was currently pending.
        CodePush.allowRestart();
    }

    componentDidMount() {
        CodePush.checkForUpdate()
            .then((update)=> {
                if (!update) {
                    Alert.alert("检查更新",
                        "当前是最新版了",
                        [{
                            text: "ok",
                            onPress: ()=> {
                            }
                        }]);
                } else {
                    Alert.alert("check update",
                        "have new version",
                        [{
                            text: "ok",
                            onPress: ()=> {
                                CodePush.sync({updateDialog: true, installMode: CodePush.InstallMode.IMMEDIATE});
                            }
                        }]);
                }
            });
        CodePush.notifyApplicationReady();
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRows.bind(this)}
                    enableEmptySections={true}
                />

                <TouchableOpacity style={styles.button} onPress={this.checkEnabled.bind(this)}>
                    <Text>搜索增加Notify的第二个版本</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderRows(rowData) {
        return (
            <TouchableOpacity style={styles.button} onPress={()=> {
                this.toPrintPage(rowData)
            }}>
                <Text>
                    {rowData.deviceName + "/" + rowData.deviceAddress}
                </Text>
            </TouchableOpacity>
        );
    }

    toPrintPage(data) {
        this.props.navigator.push({
            name: "print",
            params: {
                data: data,
            },
        })
    }


    checkEnabled() {
        Bluetooth.isEnabled((result)=> {
            if (result) {
                this.doGenRowDatas(result);
            } else {
                this.doEnableBluetooth();
            }
        })
    }

    doGenRowDatas(result) {
        var bondedArray = [];
        Alert.alert(
            '蓝牙状态',
            '蓝牙已开启,是否搜索',
            [{
                text: 'cancel',
                onPress: ()=> {

                }
            }, {
                text: 'ok',
                onPress: ()=> {
                    //每次搜索需要清空之前的数据
                    this.setState({
                        dataSource: ds.cloneWithRows([]),
                    })
                    Bluetooth.getBondedDevices((devices)=> {
                        bondedArray.push(devices);
                        this.setState({
                            dataSource: ds.cloneWithRows(bondedArray),
                        })
                    });
                }

            }]
        );
    }

    doEnableBluetooth() {
        Alert.alert(
            '蓝牙状态',
            '蓝牙未开启,是否启用',
            [{
                text: 'cancel',
                onPress: ()=> {

                }
            }, {
                text: 'ok',
                onPress: ()=> {
                    Bluetooth.enableBluetooth();
                }

            }]
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
    button: {
        width: 300,
        height: 50,
        backgroundColor: "gray",
        alignItems: "center",
        justifyContent: 'center',
        marginBottom: 10,
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

module.exports = BTSearchComponent;