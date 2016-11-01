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
    Platform,
    ToastAndroid,
    Image,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Printer from './Bluetooth';
const TOTAL_CONSUMPTION = "消费合计";
const MONEY = "188.00";
const MONEY2 = "100.00";
const PAY_METHOD = "支付宝支付";
var options = {
    title: '选择图片',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

class BTPrintComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSource: {}
        }
    }

    componentWillMount() {
        Printer.connectPrinter(this.props.data.deviceAddress);
    }

    componentWillUnmount() {
        Printer.disconnectPrinter();
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.printTest.bind(this)}>
                    <Text>打印条形码与二维码</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.printEnglishReceipt80.bind(this)}>
                    <Text>打印英文版小票</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.printChineseReceipt80.bind(this)}>
                    <Text>打印中文版小票</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={this.chooseImage.bind(this)}>
                    <Text>选择图片打印</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.printImage.bind(this)}>
                    <Image source={this.state.imageSource} style={styles.imageStyle}/>
                </TouchableOpacity>
            </View>
        );
    }

    chooseImage() {
        ImagePicker.showImagePicker(options, (response)=> {
            if (response.customButton) {
                ToastAndroid.show(response.customButton, ToastAndroid.LONG);
            } else {
                const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
                if (Platform.OS === 'ios') {
                    const source = {uri: response.uri.replace('file://', ''), isStatic: true};
                } else {
                    const source = {uri: response.uri, isStatic: true};
                }
                this.setState({
                    imageSource: source,
                    imagePath: response.path,
                })
            }
        })
    }

    printImage() {
        ToastAndroid.show("点击了图片", ToastAndroid.LONG);
        Printer.initializePrinter();
        Printer.alignInPageCenter();
        Printer.addTextAndFeedLine("打印图片");
        Printer.addImage(this.state.imagePath);
        Printer.addFeedLines(5);
        Printer.cutPage();
        Printer.print();
    }

    printTest() {
        Printer.initializePrinter();
        Printer.alignInPageCenter();
        Printer.addTextAndFeedLine("打印机");
        Printer.addBarCode("7894561237895", 2, 300);
        Printer.addFeedLine();
        Printer.addQRCode("this is qrcode", 5);
        Printer.addFeedLines(5);
        Printer.cutPage();
        Printer.print();
    }

    printEnglishReceipt() {
        Printer.initializePrinter();
        Printer.alignInPageCenter();
        Printer.setFontSizeNormal();
        Printer.addText("We're 100 per cent Chinese\n" +
            "restaurant with Chinese stuffs\n" +
            "and chefs." +
            "We provide you with\n" +
            "traditional Chinese\n" +
            "cuisine including Sichuan food\n" +
            "and Shanghai food.In addition,\n" +
            "we offer refreshments,\n" +
            "snacks and hotpot also\n" +
            "with Chinese characteristics.\n" +
            "The environment is quite\n" +
            "as well as elegant,\n" +
            "also with Chinese style.\n" +
            "The restaurant is surrounded\n" +
            "by many hotels,\n" +
            "which is very convenient\n" +
            "for your accomodations.\n" +
            "We warmly welcome all guests\n" +
            "both from home and abroad\n" +
            "to our restaurant.");
        Printer.addFeedLines(2);
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("ORDERNUM: 100120");
        Printer.addFeedLine();
        Printer.addText("START: 20:50 Aug,2016");
        Printer.addFeedLine();
        Printer.addText("END: 21:00 Aug,2016");
        Printer.addFeedLine();
        Printer.addText("TABLENUM: A-01");
        Printer.addFeedLine();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.addText("ITEM");
        Printer.addFeedLine();
        Printer.alignInPageCenter();
        Printer.addText("NO.");
        Printer.addSpaces(10);
        Printer.addText("QTY");
        Printer.addSpaces(10);
        Printer.addText("TOTAL");
        Printer.addFeedLine();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        for (let dishIndex = 8; dishIndex < 13; dishIndex++) {
            let str = dishIndex + "" + dishIndex + "" + dishIndex + "1.00";
            Printer.alignInPageLeft();
            Printer.addText("Super Hamburger");
            Printer.addFeedLine();
            Printer.alignInPageRight();
            Printer.addText(dishIndex + "");
            Printer.addSpaces((32 - str.length) / 2);
            Printer.addText("" + dishIndex);
            Printer.addSpaces((32 - str.length) / 2);
            Printer.addText("" + dishIndex + "1.00");
            Printer.addFeedLine();
        }
        Printer.addFeedLines(2);
        Printer.alignInPageRight();
        Printer.addText("Take-Out Total");
        Printer.addSpaces(18 - MONEY.length);
        Printer.addText(MONEY);
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.addText("Cash Tendered");
        Printer.addSpaces(19 - 5);
        Printer.addText("88.00");
        Printer.addFeedLine();
        Printer.alignInPageRight();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.addText("Change");
        Printer.addSpaces(26 - MONEY2.length);
        Printer.addText(MONEY2);
        Printer.addFeedLine();
        Printer.addText("--------------------------------");
        Printer.addFeedLines(2);
        Printer.alignInPageCenter();
        Printer.addText("Thank you Please Come Again\n" +
            "This Servers as an\n" +
            "OFFICAL RECEIPT");
        Printer.addFeedLines(2);
        Printer.alignInPageLeft();
        Printer.addText(`Supplier:Chengdu 
        Jinjiang Center 
        YangGuang 1301`);
        Printer.addFeedLine();
        Printer.addText(`TIN:123456789`);
        Printer.addFeedLine();
        Printer.addText(`ACC No:165411-46545-468516`);
        Printer.addFeedLine();
        Printer.addText(`TEL:028-123456789`);
        Printer.addFeedLines(2);
        Printer.addText("THIS INVOICE/RECEIPT SHALL BE\n" +
            "VALID FOR FIVE(5) YEARS\n" +
            "FROM THE DATE OF\n" +
            "THE PERMIT TO USE");
        Printer.addFeedLines(2);

        Printer.addText(`Cust Name: _________________`);
        Printer.addFeedLines(2);
        Printer.addText(`Address: ___________________`);
        Printer.addFeedLines(2);
        Printer.addText(`TIN#:_______________________`);
        Printer.addFeedLines(2);
        Printer.addText(`Signature:________________________________`);
        Printer.addFeedLines(2);
        Printer.addText(`--------------------------------`);
        Printer.addFeedLines(2);
        Printer.alignInPageCenter();
        Printer.addText(`Thanks For Coming`);
        Printer.addFeedLines(5);
        Printer.cutPage();
        Printer.print();

    }

    printChineseReceipt(data) {
        Printer.initializePrinter();
        //Bluetooth.addHorTab();
        Printer.alignInPageCenter();
        Printer.setFontSizeDouble();
        Printer.addText("what's your name");
        Printer.addFeedLines(3);
        Printer.setFontSizeNormal();
        Printer.addText("我们店主张不求最好吃但求最贵");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("单号:007");
        Printer.addText("  人数:2");
        Printer.addText("  桌号:A-01");
        Printer.addFeedLine();
        Printer.addText("开始: 20:50");
        Printer.addText("  结账: 21:00");
        Printer.addFeedLine();
        Printer.addText("收银: 001|vally");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.addText("品名");
        Printer.addFeedLine();
        Printer.alignInPageCenter();
        Printer.addText("编号");
        Printer.addSpaces(10);
        Printer.addText("数量");
        Printer.addSpaces(10);
        Printer.addText("小记");
        Printer.addFeedLine();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        for (let dishIndex = 8; dishIndex < 15; dishIndex++) {
            let str = dishIndex + "" + dishIndex + "" + dishIndex + "1.00";
            Printer.alignInPageLeft();
            Printer.addText("红烧小萝卜头");
            Printer.addFeedLine();
            Printer.alignInPageRight();
            Printer.addText(dishIndex + "");
            Printer.addSpaces((32 - str.length) / 2);
            Printer.addText("" + dishIndex);
            Printer.addSpaces((32 - str.length) / 2);
            Printer.addText("" + dishIndex + "1.00");
            Printer.addFeedLine();
        }
        Printer.alignInPageRight();
        Printer.addFeedLine();
        Printer.addText("消费合计");
        Printer.addSpaces(32 - (TOTAL_CONSUMPTION.length) * 2 - MONEY.length);
        Printer.addText(MONEY);
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.addText("应收");
        Printer.addSpaces(23);
        Printer.addText("88.00");
        Printer.addFeedLine();
        Printer.alignInPageRight();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.addText("支付宝支付");
        Printer.addSpaces(32 - (PAY_METHOD.length) * 2 - MONEY2.length);
        Printer.addText(MONEY2);
        Printer.addFeedLine();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.alignInPageCenter();
        Printer.addText("本系统由appcookies提供,详情请上 www.fandian.io进行咨询");
        Printer.addFeedLines(5);
        Printer.cutPage();
        Printer.print();
    }

    printChineseReceipt80() {
        Printer.initializePrinter();
        //Bluetooth.addHorTab();
        Printer.alignInPageCenter();
        Printer.setFontSizeDouble();
        Printer.addText("what's your name");
        Printer.addFeedLines(3);
        Printer.setFontSizeNormal();
        Printer.addText("我们店主张不求最好吃但求最贵");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("单号:007");
        Printer.addText("  人数:2");
        Printer.addText("  桌号:A-01");
        Printer.addFeedLine();
        Printer.addText("开始: 20:50");
        Printer.addText("  结账: 21:00");
        Printer.addFeedLine();
        Printer.addText("收银: 001|vally");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.addText("品名");
        Printer.addFeedLine();
        Printer.alignInPageCenter();
        Printer.addText("编号");
        Printer.addSpaces(18);
        Printer.addText("数量");
        Printer.addSpaces(18);
        Printer.addText("小记");
        Printer.addFeedLine();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        for (let dishIndex = 8; dishIndex < 15; dishIndex++) {
            let str = dishIndex + "" + dishIndex + "" + dishIndex + "1.00";
            Printer.alignInPageLeft();
            Printer.addText("红烧小萝卜头");
            Printer.addFeedLine();
            Printer.alignInPageRight();
            Printer.addText(dishIndex + "");
            Printer.addSpaces((48 - str.length) / 2);
            Printer.addText("" + dishIndex);
            Printer.addSpaces((48 - str.length) / 2);
            Printer.addText("" + dishIndex + "1.00");
            Printer.addFeedLine();
        }
        Printer.addFeedLine();
        Printer.alignInPageRight();
        Printer.addText("消费合计");
        Printer.addSpaces(48 - (TOTAL_CONSUMPTION.length) * 2 - MONEY.length);
        Printer.addText(MONEY);
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.alignInPageRight();
        Printer.addText("应收");
        Printer.addSpaces(39);
        Printer.addText("88.00");
        Printer.addFeedLine();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.addText("支付宝支付");
        Printer.addSpaces(48 - (PAY_METHOD.length) * 2 - MONEY2.length);
        Printer.addText(MONEY2);
        Printer.addFeedLine();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.alignInPageCenter();
        Printer.addText("本系统由appcookies提供,详情请上 www.fandian.io\n" +
            "进行咨询");
        Printer.addFeedLines(5);
        Printer.cutPage();
        Printer.print();
    }

    printEnglishReceipt80() {
        Printer.initializePrinter();
        Printer.alignInPageCenter();
        Printer.addText("We're 100 per cent Chinese\n" +
            "restaurant with Chinese stuffs\n" +
            "and chefs." +
            "We provide you with\n" +
            "traditional Chinese\n" +
            "cuisine including Sichuan food\n" +
            "and Shanghai food.In addition,\n" +
            "we offer refreshments,\n" +
            "snacks and hotpot also\n" +
            "with Chinese characteristics.\n" +
            "The environment is quite\n" +
            "as well as elegant,\n" +
            "also with Chinese style.\n" +
            "The restaurant is surrounded\n" +
            "by many hotels,\n" +
            "which is very convenient\n" +
            "for your accomodations.\n" +
            "We warmly welcome all guests\n" +
            "both from home and abroad\n" +
            "to our restaurant.");
        Printer.addFeedLines(1);
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("ORDERNUM: 100120");
        Printer.addFeedLine();
        Printer.addText("START: 20:50 Aug,2016");
        Printer.addFeedLine();
        Printer.addText("END: 21:00 Aug,2016");
        Printer.addFeedLine();
        Printer.addText("TABLENUM: A-01");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.addText("ITEM");
        Printer.addFeedLine();
        Printer.alignInPageCenter();
        Printer.addText("NO.");
        Printer.addSpaces(18);
        Printer.addText("QTY");
        Printer.addSpaces(18);
        Printer.addText("TOTAL");
        Printer.addFeedLine();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        for (let dishIndex = 8; dishIndex < 13; dishIndex++) {
            let str = dishIndex + "" + dishIndex + "" + dishIndex + "1.00";
            Printer.alignInPageLeft();
            Printer.addText("Super Hamburger");
            Printer.addFeedLine();
            Printer.alignInPageRight();
            Printer.addText(dishIndex + "");
            Printer.addSpaces((48 - str.length) / 2);
            Printer.addText("" + dishIndex);
            Printer.addSpaces((48 - str.length) / 2);
            Printer.addText("" + dishIndex + "1.00");
            Printer.addFeedLine();
        }
        Printer.addFeedLines(2);
        Printer.alignInPageRight();
        Printer.addText("Take-Out Total");
        Printer.addSpaces(34 - MONEY.length);
        Printer.addText(MONEY);
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.addText("Cash Tendered");
        Printer.addSpaces(35 - 5);
        Printer.addText("88.00");
        Printer.addFeedLine();
        Printer.alignInPageRight();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.addText("Change");
        Printer.addSpaces(42 - MONEY2.length);
        Printer.addText(MONEY2);
        Printer.addFeedLine();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLines(2);
        Printer.alignInPageCenter();
        Printer.addText("Thank you Please Come Again\n" +
            "This Servers as an\n" +
            "OFFICAL RECEIPT");
        Printer.addFeedLines(2);

        Printer.alignInPageLeft();
        Printer.addText("Supplier:Chengdu Jinjiang Center YangGuang 1301");
        Printer.addFeedLine();
        Printer.addText(`TIN:123456789`);
        Printer.addFeedLine();
        Printer.addText(`ACC No:165411-46545-468516`);
        Printer.addFeedLine();
        Printer.addText(`TEL:028-123456789`);
        Printer.addFeedLines(2);
        Printer.addText("THIS INVOICE/RECEIPT SHALL BE\n" +
            "VALID FOR FIVE(5) YEARS\n" +
            "FROM THE DATE OF\n" +
            "THE PERMIT TO USE");
        Printer.addFeedLines(2);
        Printer.addText(`Cust Name: _________________`);
        Printer.addFeedLines(2);
        Printer.addText(`Address: ___________________`);
        Printer.addFeedLines(2);
        Printer.addText(`TIN#:_______________________`);
        Printer.addFeedLines(2);
        Printer.addText(`Signature:________________________________`);
        Printer.addFeedLines(5);
        Printer.addText(`------------------------------------------------`);
        Printer.addFeedLines(2);
        Printer.alignInPageCenter();
        Printer.addText(`Thanks For Coming`);
        Printer.addFeedLines(5);
        Printer.cutPage();
        Printer.print();

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
    imageStyle: {
        width: 120,
        height: 120,
        margin: 10,
        resizeMode: Image.resizeMode.contain
    },
});
module.exports = BTPrintComponent;