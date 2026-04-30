package com.Omnex.IntegratedApp;

import android.content.Context;
import android.util.Log;
import com.facebook.flipper.android.AndroidFlipperClient;
import com.facebook.flipper.core.FlipperClient;
import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin;
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin;
import com.facebook.flipper.plugins.inspector.DescriptorMapping;
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin;
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor;
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin;
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin;
import com.facebook.react.modules.network.NetworkingModule;

final class ReactNativeFlipper {
  private static final String TAG = "ReactNativeFlipper";

  private ReactNativeFlipper() {}

  static void initializeFlipper(Context context) {
    try {
      Log.i(TAG, "Initializing Flipper debug plugins");
      FlipperClient client = AndroidFlipperClient.getInstance(context);
      client.addPlugin(new InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()));
      client.addPlugin(new DatabasesFlipperPlugin(context));
      client.addPlugin(new SharedPreferencesFlipperPlugin(context));
      client.addPlugin(CrashReporterPlugin.getInstance());

      NetworkFlipperPlugin networkFlipperPlugin = new NetworkFlipperPlugin();
      NetworkingModule.setCustomClientBuilder(
          builder -> builder.addNetworkInterceptor(new FlipperOkhttpInterceptor(networkFlipperPlugin)));
      client.addPlugin(networkFlipperPlugin);
      client.start();
      Log.i(TAG, "Flipper client started");
    } catch (Throwable throwable) {
      Log.e(TAG, "Failed to initialize Flipper", throwable);
    }
  }
}
