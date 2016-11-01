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
    Image,
    DeviceEventEmitter,
    ToastAndroid,
} from 'react-native';
import Bluetooth from './Bluetooth';
import CodePush from 'react-native-code-push';

const bondedDatasource = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 != r2});
const unbondDatasource = new ListView.DataSource({rowHasChanged: (r1, r2)=>r1 != r2});

class BTSearchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bondedDevices: bondedDatasource.cloneWithRows([]),
            unBondDevices: unbondDatasource.cloneWithRows([]),
        }
    }

    componentWillMount() {
        this.fetchBondedDevices();
    }

    fetchBondedDevices() {
        let bondedArray = [];
        Bluetooth.getBondedDevices((array)=> {
            for (let device of array) {
                bondedArray.push(device);
            }
            this.setState({
                bondedDevices: this.state.bondedDevices.cloneWithRows(bondedArray),
            })
        });
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
                <Text>已配对设备</Text>
                <ListView
                    dataSource={this.state.bondedDevices}
                    renderRow={this.renderBondedDeviceRows.bind(this)}
                    enableEmptySections={true}
                />
                <Text>未配对设备</Text>
                <ListView
                    dataSource={this.state.unBondDevices}
                    renderRow={this.renderUnbondDeviceRows.bind(this)}
                    enableEmptySections={true}
                />
                <TouchableOpacity style={styles.button} onPress={this.checkEnabled.bind(this)}>
                    <Text>搜索</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderBondedDeviceRows(rowData) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=> {
                this.toPrintPage(rowData)
            }}>
                <Text>
                    {rowData.deviceName + "/" + rowData.deviceAddress}
                </Text>
            </TouchableOpacity>
        );
    }

    renderUnbondDeviceRows(rowData) {
        return (
            <TouchableOpacity style={styles.row} onPress={()=> {
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
        let unbondArray = [];
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
                    this.setState({
                        unBondDevices: this.state.unBondDevices.cloneWithRows([]),
                    })

                    Bluetooth.searchDevices();

                    DeviceEventEmitter.addListener('getUnbondDevices', (map)=> {
                        unbondArray.push(map);
                        this.setState({
                            unBondDevices: this.state.unBondDevices.cloneWithRows(unbondArray),
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
    row: {
        width: 300,
        height: 50,
        backgroundColor: "orange",
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