package com.printerdemo;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Set;
import java.util.UUID;

/**
 * Created by Stan on 16/7/18.
 * 蓝牙工具
 */
public class BluetoothUtil {

    private BluetoothAdapter mBluetoothAdapter = null;

    //连接设备需要的固定UUID
    public static final UUID Bt_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB".toUpperCase());

    /**
     * 构造函数
     *
     * @param bluetoothAdapter
     */
    public BluetoothUtil(BluetoothAdapter bluetoothAdapter) {
        this.mBluetoothAdapter = bluetoothAdapter;
    }

    /**
     * 判断设备是否支持蓝牙功能
     *
     * @return true/false
     */
    public boolean isSupportBluetooth() {
        if (mBluetoothAdapter == null) {
            return false;
        }
        return true;
    }

    /**
     * 判断蓝牙是否打开
     *
     * @return true/false
     */
    public boolean isEnabled() {
        return mBluetoothAdapter.isEnabled();
    }

    /**
     * 打开蓝牙
     */
    public void enableBluetooth(Context context) {
        if (!mBluetoothAdapter.isEnabled()) {
            Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            intent.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 300);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);
        }
    }

    /**
     * 获取已配对的设备列表
     *
     * @return
     */
    public ArrayList<BluetoothDevice> getBondedDevices() {
        ArrayList<BluetoothDevice> btDevices = new ArrayList<>();

        Set<BluetoothDevice> devices = mBluetoothAdapter.getBondedDevices();

        if (devices.size() > 0) {
            for (Iterator<BluetoothDevice> it = devices.iterator(); it.hasNext(); ) {
                btDevices.add(it.next());
            }
        }

        return btDevices;
    }

    /**
     * 注册搜索蓝牙设备的广播
     *
     * @param context  当前Activity
     * @param receiver 负责接收并处理结果的广播类
     */
    public void registerBluetoothReceiver(Context context, BroadcastReceiver receiver) {
        //设置广播信息过滤
        IntentFilter intentFilter = new IntentFilter();

        //搜索蓝牙的广播
        intentFilter.addAction(BluetoothDevice.ACTION_FOUND);

        //蓝牙状态改变的广播
        intentFilter.addAction(BluetoothDevice.ACTION_BOND_STATE_CHANGED);

        //蓝牙设备扫描模式改变
        intentFilter.addAction(BluetoothAdapter.ACTION_SCAN_MODE_CHANGED);

        //蓝牙开关模式改变
        intentFilter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);

        //扫描蓝牙结束
        intentFilter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);

        //注册广播接收器，接受并处理结果
        context.registerReceiver(receiver, intentFilter);
    }

    /**
     * 搜索蓝牙设备
     */
    public void startDiscoveryDevices() {
        //搜索蓝牙设备，若果正在搜索先取消搜索
        if (mBluetoothAdapter.isDiscovering()) {
            mBluetoothAdapter.cancelDiscovery();
        }
        mBluetoothAdapter.startDiscovery();
    }

    /**
     * 取消搜索设备
     */
    public void cancelDisoveryDevices() {
        if (mBluetoothAdapter.isDiscovering()) {
            mBluetoothAdapter.cancelDiscovery();
        }
    }

    /**
     * 蓝牙配对
     *
     * @return 配对成功返回true  配对失败返回false
     */
    public boolean bondDevice(BluetoothDevice device) {
        try {
            Method createBondmethod = BluetoothDevice.class.getMethod("createBond");
            createBondmethod.invoke(device);
            return true;
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            return false;
        } catch (InvocationTargetException e) {
            e.printStackTrace();
            return false;
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            return false;
        }
    }

}
