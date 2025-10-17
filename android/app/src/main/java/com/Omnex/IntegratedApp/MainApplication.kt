package com.Omnex.IntegratedApp

import android.app.Application
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

    override val reactNativeHost: ReactNativeHost =
        object : DefaultReactNativeHost(this) {
            override fun getPackages(): List<ReactPackage> =
                PackageList(this).packages.apply {
                    // Packages that cannot be autolinked can be added manually here:
                    // add(MyCustomPackage())
                }

            override fun getJSMainModuleName(): String = "index"

            override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

            override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
            override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
        }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(applicationContext, reactNativeHost)

    /**
     * Android 14+ requires explicit receiver export visibility.
     */
    override fun registerReceiver(receiver: BroadcastReceiver?, filter: IntentFilter): Intent? {
        return if (Build.VERSION.SDK_INT >= 34 && applicationInfo.targetSdkVersion >= 34) {
            super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED)
        } else {
            super.registerReceiver(receiver, filter)
        }
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, false)

        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // Load the native entry point for the New Architecture
            load()
        }

        if (BuildConfig.DEBUG) {
            // Initialize Flipper (debug only)
            try {
                val flipperClass = Class.forName("com.Omnex.IntegratedApp.ReactNativeFlipper")
                flipperClass
                    .getMethod("initializeFlipper", Context::class.java,
                        com.facebook.react.ReactInstanceManager::class.java)
                    .invoke(null, this, reactNativeHost.reactInstanceManager)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
