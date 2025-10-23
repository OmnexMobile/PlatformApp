import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import RNBootSplash

#if DEBUG
import FlipperKit
import FlipperKitLayoutPlugin
import FlipperKitNetworkPlugin
import FlipperKitReactPlugin
import FlipperKitUserDefaultsPlugin
import SKIOSNetworkPlugin
#endif

@main
class AppDelegate: RCTAppDelegate {

  override func application(_ application: UIApplication, 
                            didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    
    #if DEBUG
    // 🔧 Initialize Flipper only in debug mode
    let client = FlipperClient.shared()
    
    if let rootView = application.delegate?.window??.rootViewController?.view {
        client?.add(FlipperKitLayoutPlugin(rootNode: rootView, with: SKDescriptorMapper()))
    }
    client?.add(FKUserDefaultsPlugin(suiteName: nil))
    client?.add(FlipperKitReactPlugin())
    client?.add(FlipperKitNetworkPlugin(networkAdapter: SKIOSNetworkAdapter()))
    client?.start()
    #endif

    // React Native module name
    self.moduleName = "IntegratedApp"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

    // Initialize RNBootSplash
    if let rootView = self.window?.rootViewController?.view {
        RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
    }

    return result
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
