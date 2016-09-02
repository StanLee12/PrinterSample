package com.printersample;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.support.annotation.Nullable;

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
import com.gprinter.command.EscCommand;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Vector;

/**
 * Created by Stan on 16/7/18.
 */
public class BluetoothModule extends ReactContextBaseJavaModule {

    private final String BLUETOOTH = "BluetoothModule";

    private BluetoothUtil mBluetoothUtil = null;

    private ArrayList<BluetoothDevice> mBondList = null;

    private ArrayList<BluetoothDevice> mUnbondList = null;

    private BluetoothPort mPort = null;

    private EscCommand mCommand = null;

    private static final String WIDTH_ZOOM_LEVEL_1 = "WIDTH_ZOOM_ONE";

    private static final String WIDTH_ZOOM_LEVEL_2 = "WIDTH_ZOOM_TWO";

    private static final String WIDTH_ZOOM_LEVEL_3 = "WIDTH_ZOOM_THREE";

    private static final String HEIGHT_ZOOM_LEVEL_1 = "HEIGHT_ZOOM_ONE";

    private static final String HEIGHT_ZOOM_LEVEL_2 = "HEIGHT_ZOOM_TWO";

    private static final String HEIGHT_ZOOM_LEVEL_3 = "HEIGHT_ZOOM_THREE";

    public BluetoothModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mBluetoothUtil = new BluetoothUtil(BluetoothAdapter.getDefaultAdapter());
        mBondList = new ArrayList<>();
        mUnbondList = new ArrayList<>();
    }

    @Override
    public String getName() {
        return BLUETOOTH;
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
        WritableArray array = new WritableNativeArray();
        WritableMap map = new WritableNativeMap();
        for (int i = 0; i < btDevices.size(); i++) {
            //已配对设备集合

            map.putString("deviceName", btDevices.get(i).getName());
            map.putString("deviceAddress", btDevices.get(i).getAddress());
            //已配对设备集合
            mBondList.add(btDevices.get(i));

        }
        callback.invoke(map);

    }


    /**
     * 开始搜索设备｀
     *
     * @param
     */
    @ReactMethod
    public void discoveryhDevices() {
        mBluetoothUtil.registerBluetoothReceiver(getReactApplicationContext(), receiver);
        mBluetoothUtil.startDiscoveryDevices();
    }

    /**
     * 搜索设备的广播
     */
    public BroadcastReceiver receiver = new BroadcastReceiver() {
        String unbondAddress = "";
        String bondedAddress = "";

        @Override
        public void onReceive(Context context, Intent intent) {
            String action = intent.getAction();

            if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                if (device.getBondState() != BluetoothDevice.BOND_BONDED) {
                    if (!unbondAddress.equals(device.getAddress())) {
                        mUnbondList.add(device);
                        WritableMap map = new WritableNativeMap();
                        map.putString("deviceName", device.getName());
                        map.putString("deviceAddress", device.getAddress());
                        sendUnbond(getReactApplicationContext(), "getUnbondDevices", map);
                        unbondAddress = device.getAddress();
                    }
                } else {
                    //判断是否重复添加
                    if (bondedAddress.equals(device.getAddress()) == false) {
                        mBondList.add(device);
                        WritableMap map = new WritableNativeMap();
                        map.putString("deviceName", device.getName());
                        map.putString("deviceAddress", device.getAddress());
                        sendBonded(getReactApplicationContext(), "getBondedDevices", map);
                        bondedAddress = device.getAddress();
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
    private void sendUnbond(ReactContext reactContext, String eventName, @Nullable WritableMap param) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, param);
    }

    /**
     * 搜索已配对设备
     *
     * @param reactContext
     * @param eventName
     * @param param
     */
    private void sendBonded(ReactContext reactContext, String eventName, @Nullable WritableMap param) {
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

        for (int i = 0; i < mUnbondList.size(); i++) {
            if (mUnbondList.get(i).getAddress().equals(deviceAddress)) {
                isBonded = mBluetoothUtil.bondDevice(mUnbondList.get(i));
            }
        }

        callback.invoke(isBonded);
    }

    @ReactMethod
    public void connect(String deviceAddress) {
        BluetoothDevice device = null;
        for (int i = 0; i < mBondList.size(); i++) {
            if (mBondList.get(i).getAddress().equals(deviceAddress)) {
                device = mBondList.get(i);
            }
        }
        mPort = new BluetoothPort(device);
        boolean isConnection = mPort.connect();
        if (isConnection) {
            mCommand = new EscCommand();
        }
    }

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

    @ReactMethod
    public void addHorTab() {
        mCommand.addHorTab();
    }

    @ReactMethod
    public void addText(String str) {
        mCommand.addText(str, "UTF-8");
    }

    @ReactMethod
    public void addFeedLine() {
        mCommand.addPrintAndLineFeed();
    }

    @ReactMethod
    public void addFeedLines(int lines) {
        mCommand.addPrintAndFeedLines((byte) lines);
    }

    @ReactMethod
    public void cutPage() {
        mCommand.addCutPaper();
    }

    @ReactMethod
    public void alignInPageLeft() {
        mCommand.addSelectJustification(EscCommand.JUSTIFICATION.LEFT);
    }

    @ReactMethod
    public void alignInPageCenter() {
        mCommand.addSelectJustification(EscCommand.JUSTIFICATION.CENTER);
    }

    @ReactMethod
    public void alignInPageRight() {
        mCommand.addSelectJustification(EscCommand.JUSTIFICATION.RIGHT);
    }

    @ReactMethod
    public void setTextSizeZoom1() {
        mCommand.addSetCharcterSize(EscCommand.WIDTH_ZOOM.MUL_1, EscCommand.HEIGHT_ZOOM.MUL_1);
    }

    @ReactMethod
    public void setTextSizeZoom2() {
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

    @ReactMethod
    public void setPosition(int n) {
        mCommand.addSetAbsolutePrintPosition((short) n);
    }

    @ReactMethod
    public void setMarginLeft(int marginLeft) {

    }

    @ReactMethod
    public void print() {
        Vector<Byte> datas = mCommand.getCommand();

        mPort.sendESC(datas);
    }

    @ReactMethod
    public void disConnect() {
        if (mPort != null) {
            mPort.disconnect();
            mPort = null;
            mCommand = null;
        }
    }
}
