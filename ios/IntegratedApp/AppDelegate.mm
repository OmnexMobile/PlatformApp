#import "AppDelegate.h"
#import "RNBootSplash.h"

#import <React/RCTBundleURLProvider.h>

#if DEBUG
// Flipper imports (debug only)
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#if DEBUG
  // 🔧 Initialize Flipper only in debug mode
  FlipperClient *client = [FlipperClient sharedClient];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
#endif

  // Set your React Native module name (same as in index.js -> AppRegistry.registerComponent)
  self.moduleName = @"IntegratedApp";
    // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Call super implementation
  BOOL result = [super application:application didFinishLaunchingWithOptions:launchOptions];

  // Initialize RNBootSplash
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:self.window.rootViewController.view];

  return result;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


@end
