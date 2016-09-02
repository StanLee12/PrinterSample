package com.printersample;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothSocket;
import android.util.Log;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Vector;

/**
 * Created by Stan on 16/6/23.
 */
public class BluetoothPort {

    private boolean isConnection = false;

    private BluetoothDevice mDevice = null;

    private BluetoothSocket mSocket = null;

    private OutputStream mOutputStream = null;

    private BluetoothAdapter mAdapter = null;

    public BluetoothPort(BluetoothDevice device) {
        this.mDevice = device;
        mAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    /**
     * connect BluetoothDevice
     *
     * @return boolean
     */
    public boolean connect() {
        if (!isConnection) {
            try {

                mSocket = mDevice.createRfcommSocketToServiceRecord(BluetoothUtil.Bt_UUID);

                mSocket.connect();

                mOutputStream = mSocket.getOutputStream();

                isConnection = true;

            } catch (IOException e) {
                e.printStackTrace();
                return false;
            }
            return true;
        }
        return true;
    }

    /**
     * disconnect BluetoothDevice
     *
     * @return boolean
     */
    public boolean disconnect() {
        if (isConnection) {

            if (mSocket != null) {
                try {

                    mOutputStream.close();

                    mSocket.close();

                    return true;
                } catch (IOException e) {
                    e.printStackTrace();
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * send print str
     *
     * @param sendData
     * @param encoding
     */
    public void send(String sendData, String encoding) {
        if (isConnection) {
            try {

                byte[] data = sendData.getBytes(encoding);

                mOutputStream.write(data, 0, data.length);
                mOutputStream.flush();

            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
                Log.i("printIOException", "send: print faild");
            }
        } else {
            Log.i("connection", "send: none");
        }
    }

    /**
     * print esc command
     *
     * @param data
     */
    public void sendESC(Vector<Byte> data) {
        if (isConnection) {
            if (data != null && data.size() > 0) {
                byte[] sendData = new byte[data.size()];
                for (int i = 0; i < data.size(); i++) {
                    sendData[i] = data.get(i).byteValue();
                }
                try {
                    mOutputStream.write(sendData);
                    mOutputStream.flush();
                } catch (IOException e) {
                    e.printStackTrace();
                    Log.e("print message", "sendESC: failed");
                }
            }
        }
    }
}
