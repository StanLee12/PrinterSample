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

import Printer from './Bluetooth';
var TOTAL_CONSUMPTION = "消费合计";
var MONEY = "188.00";
var MONEY2 = "100.00";
var PAY_METHOD = "支付宝支付";

class BTPrintComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
        Printer.connect(this.props.data.deviceAddress);
    }

    componentWillUnmount() {
        Printer.disConnect();
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={this.printLocalReceipt.bind(this)}>
                    <Text>打印</Text>
                </TouchableOpacity>
            </View>
        );
    }

    printNationReceipt() {
        Printer.initPrinter();
        Printer.alignInPageCenter();
        Printer.setTextSizeZoom1();
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
        Printer.setTextSizeZoom1();
        Printer.alignInPageLeft();
        Printer.addText("ORDERNUM: 100120");
        Printer.addFeedLine();
        Printer.addText("START: 20:50 Aug,2016");
        Printer.addFeedLine();
        Printer.addText("END: 21:00 Aug,2016");
        Printer.addFeedLine();
        Printer.addText("TABLENUM: A-01");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.alignInPageLeft();
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
        for (let i = 8; i < 13; i++) {
            let str = i + "" + i + "" + i + "1.00";
            Printer.alignInPageLeft();
            Printer.addText("Super Hamburger");
            Printer.addFeedLine();
            Printer.alignInPageRight();
            Printer.addText(i + "");
            Printer.addSpaces((32 - str.length) / 2);
            Printer.addText("" + i);
            Printer.addSpaces((32 - str.length) / 2);
            Printer.addText("" + i + "1.00");
            Printer.addFeedLine();
        }
        Printer.addFeedLines(2);
        Printer.alignInPageRight();
        Printer.addText("Take-Out Total");
        Printer.addSpaces(18 - MONEY.length);
        Printer.addText(MONEY);
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.addText("Cash Tendered");
        Printer.addSpaces(19 - 5);
        Printer.addText("88.00");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.alignInPageRight();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.addText("Change");
        Printer.addSpaces(26 - MONEY2.length);
        Printer.addText(MONEY2);
        Printer.setTextSizeZoom1();
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

    printLocalReceipt(data) {
        Printer.initPrinter();
        //Bluetooth.addHorTab();
        Printer.alignInPageCenter();
        Printer.setTextSizeZoom2();
        Printer.addText("what's your name");
        Printer.addFeedLines(3);
        Printer.setTextSizeZoom1();
        Printer.addText("我们店主张不求最好吃但求最贵");
        Printer.addFeedLine();
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
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
        Printer.setTextSizeZoom1();
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.setTextSizeZoom1();
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
        for (let i = 8; i < 15; i++) {
            let str = i + "" + i + "" + i + "1.00";
            Printer.alignInPageLeft();
            Printer.addText("红烧小萝卜头");
            Printer.addFeedLine();
            Printer.alignInPageRight();
            Printer.addText(i + "");
            Printer.addSpaces((32 - str.length) / 2);
            Printer.addText("" + i);
            Printer.addSpaces((32 - str.length) / 2);
            Printer.addText("" + i + "1.00");
            Printer.addFeedLine();
        }
        Printer.alignInPageRight();
        Printer.addFeedLine();
        Printer.addText("消费合计");
        Printer.addSpaces(32 - (TOTAL_CONSUMPTION.length) * 2 - MONEY.length);
        Printer.addText(MONEY);
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.alignInPageLeft();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.addText("应收");
        Printer.addSpaces(23);
        Printer.addText("88.00");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.alignInPageRight();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.addText("支付宝支付");
        Printer.addSpaces(32 - (PAY_METHOD.length) * 2 - MONEY2.length);
        Printer.addText(MONEY2);
        Printer.setTextSizeZoom1();
        Printer.addFeedLine();
        Printer.addText("--------------------------------");
        Printer.addFeedLine();
        Printer.alignInPageCenter();
        Printer.addText("本系统由appcookies提供,详情请上 www.fandian.io进行咨询");
        Printer.addFeedLines(5);
        Printer.cutPage();
        Printer.print();
    }

    printLocalReceipt80() {
        Printer.initPrinter();
        //Bluetooth.addHorTab();
        Printer.alignInPageCenter();
        Printer.setTextSizeZoom2();
        Printer.addText("what's your name");
        Printer.addFeedLines(3);
        Printer.setTextSizeZoom1();
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
        for (let i = 8; i < 15; i++) {
            let str = i + "" + i + "" + i + "1.00";
            Printer.alignInPageLeft();
            Printer.addText("红烧小萝卜头");
            Printer.addFeedLine();
            Printer.alignInPageRight();
            Printer.addText(i + "");
            Printer.addSpaces((48 - str.length) / 2);
            Printer.addText("" + i);
            Printer.addSpaces((48 - str.length) / 2);
            Printer.addText("" + i + "1.00");
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

    printNationReceipt80() {
        Printer.initPrinter();
        Printer.alignInPageCenter();
        Printer.setTextSizeZoom1();
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
        Printer.setTextSizeZoom1();
        Printer.alignInPageLeft();
        Printer.addText("ORDERNUM: 100120");
        Printer.addFeedLine();
        Printer.addText("START: 20:50 Aug,2016");
        Printer.addFeedLine();
        Printer.addText("END: 21:00 Aug,2016");
        Printer.addFeedLine();
        Printer.addText("TABLENUM: A-01");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
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
        for (let i = 8; i < 13; i++) {
            let str = i + "" + i + "" + i + "1.00";
            Printer.alignInPageLeft();
            Printer.addText("Super Hamburger");
            Printer.addFeedLine();
            Printer.alignInPageRight();
            Printer.addText(i + "");
            Printer.addSpaces((48 - str.length) / 2);
            Printer.addText("" + i);
            Printer.addSpaces((48 - str.length) / 2);
            Printer.addText("" + i + "1.00");
            Printer.addFeedLine();
        }
        Printer.addFeedLines(2);
        Printer.alignInPageRight();
        Printer.addText("Take-Out Total");
        Printer.addSpaces(34 - MONEY.length);
        Printer.addText(MONEY);
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.alignInPageLeft();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.addText("Cash Tendered");
        Printer.addSpaces(35 - 5);
        Printer.addText("88.00");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.alignInPageRight();
        Printer.addText("------------------------------------------------");
        Printer.addFeedLine();
        Printer.setTextSizeZoom1();
        Printer.addText("Change");
        Printer.addSpaces(42 - MONEY2.length);
        Printer.addText(MONEY2);
        Printer.setTextSizeZoom1();
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
});
module.exports = BTPrintComponent;