package com.Omnex.IntegratedApp;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import com.zoontek.rnbootsplash.RNBootSplash;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript.
   * This is used to schedule rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "IntegratedApp";
  }

  /**
   * Initialize RNBootSplash before React content is loaded.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    RNBootSplash.init(this); // initialize the splash screen
    super.onCreate(null);
  }

  /**
   * Returns the ReactActivityDelegate instance.
   * Using DefaultReactActivityDelegate automatically supports:
   * - Fabric (New Renderer)
   * - Concurrent React (React 18)
   * based on your build configuration.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
       // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled()
    );
  }
}
