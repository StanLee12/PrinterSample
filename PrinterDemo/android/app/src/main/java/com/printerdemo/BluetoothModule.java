package com.printerdemo;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.annotation.Nullable;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.printerdemo.BluetoothUtil;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Vector;

/**
 * Created by Stan on 16/7/18.
 */
public class BluetoothModule extends ReactContextBaseJavaModule {

    private final static String BLUETOOTH_MODULE = "BluetoothModule";

    private BluetoothUtil mBluetoothUtil = null;

    private ArrayList<BluetoothDevice> mBondDevices = null;

    private ArrayList<BluetoothDevice> mUnbondDevices = null;

    private BluetoothPort mPort = null;

    private EscCommand mCommand = null;

    private Vector<Byte> datas = null;


    public BluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mBluetoothUtil = new BluetoothUtil(BluetoothAdapter.getDefaultAdapter());
        mBondDevices = new ArrayList<>();
        mUnbondDevices = new ArrayList<>();
    }

    @Override
    public String getName() {
        return BLUETOOTH_MODULE;
    }

    /**
     * 是否支持蓝牙
     */
    @ReactMethod
    public void isSupport(Callback callback) {
        boolean support = mBluetoothUtil.isSupportBluetooth();
        callback.invoke(support);
    }

    /**
     * 蓝牙是否启用
     *
     * @param callback
     */
    @ReactMethod
    public void isEnabled(Callback callback) {
        boolean open = mBluetoothUtil.isEnabled();
        callback.invoke(open);
    }

    /**
     * 启用蓝牙
     */
    @ReactMethod
    public void enableBluetooth() {
        mBluetoothUtil.enableBluetooth(getReactApplicationContext());
    }

    /**
     * 获取已配对设备
     */
    @ReactMethod
    public void getBondedDevices(Callback callback) {
        ArrayList<BluetoothDevice> btDevices = mBluetoothUtil.getBondedDevices();
        WritableArray devices = new WritableNativeArray();
        for (int i = 0; i < btDevices.size(); i++) {

            WritableMap bondedDevices = new WritableNativeMap();
            bondedDevices.putString("deviceName", btDevices.get(i).getName());
            bondedDevices.putString("deviceAddress", btDevices.get(i).getAddress());

            mBondDevices.add(btDevices.get(i));
            devices.pushMap(bondedDevices);
        }
        callback.invoke(devices);
    }


    /**
     * 开始搜索设备
     *
     * @param
     */
    @ReactMethod
    public void searchDevices() {
        mBluetoothUtil.registerBluetoothReceiver(getReactApplicationContext(), searchDevicesReceiver);
        mBluetoothUtil.startDiscoveryDevices();
    }

    /**
     * 搜索设备的广播
     */
    public BroadcastReceiver searchDevicesReceiver = new BroadcastReceiver() {
        String unbondAddress = "";
        String bondedAddress = "";

        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();

            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device.getBondState() != BluetoothDevice.BOND_BONDED) {
                    if (!unbondAddress.equals(device.getAddress())) {
                        mUnbondDevices.add(device);
                        WritableMap unBondDevices = new WritableNativeMap();
                        unBondDevices.putString("deviceName", device.getName());
                        unBondDevices.putString("deviceAddress", device.getAddress());
                        sendUnbondDevice(getReactApplicationContext(), "getUnbondDevices", unBondDevices);
                        unbondAddress = device.getAddress();
                    }
                }
            } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                //搜索结束解除注册
                getReactApplicationContext().unregisterReceiver(this);
                mBluetoothUtil.cancelDisoveryDevices();
            }
        }
    };


    /**
     * 搜索设备并发送未配对设备信息的监听方法
     *
     * @param reactContext 当前上下文
     * @param eventName    事件名称
     * @param param        发送的参数
     */
    private void sendUnbondDevice(ReactContext reactContext, String eventName, @Nullable WritableMap param) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, param);
    }

    /**
     * 搜索已配对设备
     *
     * @param reactContext
     * @param eventName
     * @param param
     */
    private void sendBondedDevice(ReactContext reactContext, String eventName, @Nullable WritableMap param) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, param);
    }

    /**
     * 配对设备
     *
     * @param deviceAddress 根据设备地址进行设备的配对
     * @param callback      返回配对成功信息
     */
    @ReactMethod
    public void bondDevice(String deviceAddress, Callback callback) {
        boolean isBonded = false;

        for (int i = 0; i < mUnbondDevices.size(); i++) {
            if (mUnbondDevices.get(i).getAddress().equals(deviceAddress)) {
                isBonded = mBluetoothUtil.bondDevice(mUnbondDevices.get(i));
            }
        }

        callback.invoke(isBonded);
    }

    /**
     * 连接打印机
     *
     * @param deviceAddress
     */
    @ReactMethod
    public void connectPrinter(String deviceAddress) {
        BluetoothDevice device = null;
        for (int i = 0; i < mBondDevices.size(); i++) {
            if (mBondDevices.get(i).getAddress().equals(deviceAddress)) {
                device = mBondDevices.get(i);
            }
        }
        mPort = new BluetoothPort(device);
    }

    /**
     * 打印测试
     */
    @ReactMethod
    public void printTest() {

        mCommand.addSelectJustification(EscCommand.JUSTIFICATION.CENTER);

        mCommand.addText("你好啊", "UTF-8");
        mCommand.addPrintAndLineFeed();

        mCommand.addText("Hello");
        mCommand.addPrintAndLineFeed();

        mCommand.addText("123123");
        mCommand.addPrintAndLineFeed();

        mCommand.addText("!@@#$%^&*(()");
        mCommand.addPrintAndLineFeed();

        //条形码
        mCommand.addSelectPrintingPositionForHRICharacters(EscCommand.HRI_POSITION.BELOW);
        mCommand.addSetBarcodeHeight((byte) 160);
        mCommand.addSetBarcodeWidth((byte) 3);
        mCommand.addUPCE("123456789011");
        mCommand.addPrintAndLineFeed();

        //二维码
        mCommand.addSelectErrorCorrectionLevelForQRCode((byte) 0x31);
        mCommand.addSelectSizeOfModuleForQRCode((byte) 10);
        mCommand.addStoreQRCodeData("this is qrCode");
        mCommand.addPrintQRCode();
        mCommand.addPrintAndFeedLines((byte) 5);

        mCommand.addCutPaper();

        Vector<Byte> datas = mCommand.getCommand();

        mPort.sendESC(datas);
    }

    /**
     * 初始化打印机
     */
    @ReactMethod
    public void initializePrinter() {

        boolean connected = mPort.connect();
        if (connected) {
            mCommand = new EscCommand();
            mCommand.addInitializePrinter();
        }

    }


    /**
     * 添加文本
     *
     * @param str 字符串
     */
    @ReactMethod
    public void addText(String str) {
        mCommand.addText(str, "UTF-8");
    }

    @ReactMethod
    public void addTextAndFeedLine(String str) {
        mCommand.addText(str, "UTF-8");
        mCommand.addPrintAndLineFeed();
    }

    /**
     * 走纸一行
     */
    @ReactMethod
    public void addFeedLine() {
        mCommand.addPrintAndLineFeed();
    }

    @ReactMethod
    public void addFeedLines(int lines) {
        mCommand.addPrintAndFeedLines((byte) lines);
    }

    /**
     * 打印条形码
     *
     * @param content   条形码内容
     * @param barWidth  条形码每条的宽
     * @param barHeight 条形码的高
     */
    @ReactMethod
    public void addBarCode(String content, int barWidth, int barHeight) {
        mCommand.addSelectPrintingPositionForHRICharacters(EscCommand.HRI_POSITION.BELOW);
        mCommand.addSetBarcodeWidth((byte) barWidth);
        mCommand.addSetBarcodeHeight((byte) barHeight);
        mCommand.addUPCA(content);
    }

    /**
     * 打印二维码
     *
     * @param content 二维码内容
     * @param size    二维码大小
     */
    @ReactMethod
    public void addQRCode(String content, int size) {
        mCommand.addSelectErrorCorrectionLevelForQRCode((byte) 0x31);
        mCommand.addSelectSizeOfModuleForQRCode((byte) size);
        mCommand.addStoreQRCodeData(content);
        mCommand.addPrintQRCode();
    }

    /**
     * 设置后面的内容居于纸的左侧
     */
    @ReactMethod
    public void alignInPageLeft() {
        mCommand.addSelectJustification(EscCommand.JUSTIFICATION.LEFT);
    }

    /**
     * 设置后面的内容居于纸的正中间
     */
    @ReactMethod
    public void alignInPageCenter() {
        mCommand.addSelectJustification(EscCommand.JUSTIFICATION.CENTER);
    }

    /**
     * 设置后面的内容居于纸的右侧
     */
    @ReactMethod
    public void alignInPageRight() {
        mCommand.addSelectJustification(EscCommand.JUSTIFICATION.RIGHT);
    }

    /**
     * 设置后面的文本字体为普通大小
     */
    @ReactMethod
    public void setFontSizeNormal() {
        mCommand.addSetCharcterSize(EscCommand.WIDTH_ZOOM.MUL_1, EscCommand.HEIGHT_ZOOM.MUL_1);
    }

    /**
     * 设置后面的文本字体为两倍大小
     */
    @ReactMethod
    public void setFontSizeDouble() {
        mCommand.addSetCharcterSize(EscCommand.WIDTH_ZOOM.MUL_2, EscCommand.HEIGHT_ZOOM.MUL_2);
    }

    @ReactMethod
    public void setFontA() {
        mCommand.addSetFontForHRICharacter(EscCommand.FONT.FONTA);
    }

    @ReactMethod
    public void setFontB() {
        mCommand.addSetFontForHRICharacter(EscCommand.FONT.FONTB);
    }

    /**
     * 设置绝对位置
     *
     * @param n
     */
    @ReactMethod
    public void setPosition(int n) {
        mCommand.addSetAbsolutePrintPosition((short) n);
    }

    /**
     * 左边距
     *
     * @param marginLeft
     */
    @ReactMethod
    public void setMarginLeft(int marginLeft) {
        mCommand.addSetLeftMargin((short) marginLeft);
    }


    /**
     * 设置图片的相对位置
     *
     * @param r
     */
    @ReactMethod
    public void setRelative(int r) {
        mCommand.addSetRelativePrintPositon((short) r);
    }


    /**
     * 打印图片,传入图片的路径uri
     *
     * @param path
     */
    @ReactMethod
    public void addImage(String path) {
        Bitmap image = BitmapFactory.decodeFile(path);
        mCommand.addRastBitImage(image, image.getWidth(), 0);
    }


    /**
     * 打印空格,同一行中
     *
     * @param s 空格的个数
     */
    @ReactMethod
    public void addSpaces(int s) {
        for (int i = 0; i < s; i++) {
            mCommand.addSpace();
        }
    }

    /**
     * 切纸
     */
    @ReactMethod
    public void cutPage() {
        mCommand.addCutPaper();
    }


    /**
     * 执行打印
     */
    @ReactMethod
    public void print() {
        datas = mCommand.getCommand();
        mPort.sendESC(datas);
        datas = null;
        mCommand = null;
    }

    /**
     * 断开打印机的连接
     */
    @ReactMethod
    public void disconnectPrinter() {
        if (mPort != null) {
            mPort.disconnect();
            mPort = null;
            mCommand = null;
        }
    }
}
