import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
import FirebaseMessaging  // ✅ Add this
import RNBootSplash
import UserNotifications  // ✅ Add this

@main
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate, MessagingDelegate ,RNAppAuthAuthorizationFlowManager{  // ✅ Add delegates
  var window: UIWindow?
  public weak var authorizationFlowManagerDelegate: RNAppAuthAuthorizationFlowManagerDelegate?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    FirebaseApp.configure()

    // ✅ Add these lines
    UNUserNotificationCenter.current().delegate = self
    Messaging.messaging().delegate = self
    application.registerForRemoteNotifications()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "IntegratedApp",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
// func application(
//   _ app: UIApplication,
//   open url: URL,
//   options: [UIApplication.OpenURLOptionsKey: Any] = [:]
// ) -> Bool {

//   if let delegate = authorizationFlowManagerDelegate,
//      delegate.resumeExternalUserAgentFlow(with: url) {
//     return true
//   }

//   return RCTLinkingManager.application(
//     app,
//     open: url,
//     options: options
//   )
// }
// func application(
//   _ app: UIApplication,
//   open url: URL,
//   options: [UIApplication.OpenURLOptionsKey: Any] = [:]
// ) -> Bool {
//   NSLog("🔗 openURL called: \(url.absoluteString)")
//   NSLog("🔗 flow delegate nil? \(authorizationFlowManagerDelegate == nil)")

//   if let delegate = authorizationFlowManagerDelegate {
//     let handled = delegate.resumeExternalUserAgentFlow(with: url)
//     NSLog("🔗 AppAuth handled: \(handled)")
//     if handled { return true }
//   }

//   return RCTLinkingManager.application(app, open: url, options: options)
// }
func application(
  _ app: UIApplication,
  open url: URL,
  options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
 NSLog("🔗 openURL called: \(url.absoluteString)")
  NSLog("🔗 flow delegate nil? \(authorizationFlowManagerDelegate == nil)")
  // Azure returns scheme://host/?code=... ; AppAuth expects scheme://host?code=...
  var normalizedURL = url
  if var components = URLComponents(url: url, resolvingAgainstBaseURL: false),
     components.path == "/" {
    components.path = ""
    normalizedURL = components.url ?? url
  }
 NSLog("🔗 openURL normalizedURL: \(normalizedURL)")
 NSLog("🔗 openURL authorizationFlowManagerDelegate: \(authorizationFlowManagerDelegate)")

  if let delegate = authorizationFlowManagerDelegate,
     delegate.resumeExternalUserAgentFlow(with: normalizedURL) {
    return true
  }

  return RCTLinkingManager.application(app, open: url, options: options)
}
  // ✅ Forward APNS token to Firebase — THIS fixes "No APNS token" error
  func application(_ application: UIApplication,
                   didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Messaging.messaging().apnsToken = deviceToken
    print("✅ APNS Token received and forwarded to Firebase")
  }

  func application(_ application: UIApplication,
                   didFailToRegisterForRemoteNotificationsWithError error: Error) {
    print("❌ Failed to register for remote notifications: \(error)")
  }

  // ✅ FCM token refresh callback
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    print("✅ FCM Token refreshed: \(fcmToken ?? "nil")")
  }

  // ✅ Show notification when app is in FOREGROUND
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    print("📩 willPresent called") // ✅ Add thi
    if #available(iOS 14.0, *) {
      completionHandler([.banner, .sound, .list])
    } else {
      completionHandler([.alert, .sound])
    }
  }

  // ✅ Handle notification tap
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
     print("📩 willPresent called1") // ✅ Add thi
    completionHandler()
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  override func customize(_ rootView: RCTRootView) {
    super.customize(rootView)
    RNBootSplash.initWithStoryboard("BootSplash", rootView: rootView)
  }
}
