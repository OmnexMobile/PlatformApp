#import "AppDelegate.h"

#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#if __has_include(<RNBootSplash/RNBootSplash.h>)
#import <RNBootSplash/RNBootSplash.h>
#else
#import "RNBootSplash.h"
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.moduleName = @"IntegratedApp";
    self.dependencyProvider = [RCTAppDependencyProvider new];
    self.initialProps = @{};

    return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)customizeRootView:(RCTRootView *)rootView
{
    [super customizeRootView:rootView];
    [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  NSURL *bundleURL = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  if (bundleURL != nil) {
    return bundleURL;
  }

  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
