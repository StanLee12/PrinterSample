package com.printerdemo;

import com.facebook.react.ReactActivity;
import com.microsoft.codepush.react.CodePush;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PrinterDemo";
    }

    @Override
    public int checkSelfPermission(String permission) {
        return 0;
    }

    @Override
    public boolean shouldShowRequestPermissionRationale(String permission) {
        return false;
    }
}
