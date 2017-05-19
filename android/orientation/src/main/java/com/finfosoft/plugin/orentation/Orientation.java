package com.finfosoft.plugin.orentation;
import android.app.Activity;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;

/**
 * Created by dell on 2017/1/10.
 */

public class Orientation extends ReactContextBaseJavaModule {
    public Orientation(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Orientation";
    }

    /**
     * 横屏
     */
    @ReactMethod
    public void transverse() {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Activity activity = getCurrentActivity();
                if(activity == null){
                    return;
                }
                if(activity.getResources().getConfiguration().orientation == Configuration.ORIENTATION_PORTRAIT){
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                    //设置全屏
                    Window window = activity.getWindow();
                    WindowManager.LayoutParams params = window.getAttributes();
                    params.flags |= WindowManager.LayoutParams.FLAG_FULLSCREEN;
                    window.setAttributes(params);
                }
            }
        });
    }
    /**
     * 竖屏
     */
    @ReactMethod
    public void vertical() {
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Activity activity = getCurrentActivity();
                if (activity == null) {
                    return;
                }
                if (activity.getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
                    activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                    //设置非全屏
                    Window window = activity.getWindow();
                    WindowManager.LayoutParams params = window.getAttributes();
                    params.flags &= (~WindowManager.LayoutParams.FLAG_FULLSCREEN);
                    window.setAttributes(params);
                }
            }
        });
    }
}
