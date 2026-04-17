package com.Omnex.IntegratedApp;

import android.app.Application;
import android.content.Context;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactHost;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.react.soloader.OpenSourceMergedSoMapping;
import com.facebook.soloader.SoLoader;
import java.io.IOException;
import java.util.List;
import org.jetbrains.annotations.Nullable;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          try {
            packages.add(
                (ReactPackage)
                    Class.forName("com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage")
                        .getDeclaredConstructor()
                        .newInstance());
          } catch (Exception ignored) {
            // Keep startup working even if the legacy datetime picker package is missing.
          }
          try {
            packages.add(
                (ReactPackage)
                    Class.forName("com.reactnativecommunity.slider.ReactSliderPackage")
                        .getDeclaredConstructor()
                        .newInstance());
          } catch (Exception ignored) {
            // Keep startup working even if the slider package is missing.
          }
          try {
            packages.add(
                (ReactPackage)
                    Class.forName("com.devfd.RNGeocoder.RNGeocoderPackage")
                        .getDeclaredConstructor()
                        .newInstance());
          } catch (Exception ignored) {
            // Keep startup working even if the legacy geocoder package is missing.
          }
          try {
            packages.add(
                (ReactPackage)
                    Class.forName("com.reactnativecompressor.CompressorPackage")
                        .getDeclaredConstructor()
                        .newInstance());
          } catch (Exception ignored) {
            // Keep startup working even if the compressor package is missing.
          }
          try {
            packages.add(
                (ReactPackage)
                    Class.forName("com.jimmydaddy.imagemarker.ImageMarkerPackage")
                        .getDeclaredConstructor()
                        .newInstance());
          } catch (Exception ignored) {
            // Keep startup working even if the image marker package is missing.
          }
          try {
            packages.add(
                (ReactPackage)
                    Class.forName("com.reactnativepagerview.PagerViewPackage")
                        .getDeclaredConstructor()
                        .newInstance());
          } catch (Exception ignored) {
            // Keep startup working even if the pager view package is missing.
          }
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public ReactHost getReactHost() {
    return DefaultReactHost.getDefaultReactHost(
        getApplicationContext(), getReactNativeHost(), null);
  }

  @Override
  public Intent registerReceiver(@Nullable BroadcastReceiver receiver, IntentFilter filter) {
    if (Build.VERSION.SDK_INT >= 34 && getApplicationInfo().targetSdkVersion >= 34) {
      return super.registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
    } else {
      return super.registerReceiver(receiver, filter);
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    try {
      SoLoader.init(this, OpenSourceMergedSoMapping.INSTANCE);
    } catch (IOException exception) {
      throw new RuntimeException("Failed to initialize SoLoader", exception);
    }
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load();
    }
  }
}
