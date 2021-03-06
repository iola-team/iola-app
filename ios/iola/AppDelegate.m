/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <RNSplashScreen.h>

#import <AppCenterReactNativeShared/AppCenterReactNativeShared.h>
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#import <AppCenterReactNativePush.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [AppCenterReactNative register];
  [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
  [AppCenterReactNativePush register];

  NSMutableDictionary *initialProperties = [[NSMutableDictionary alloc] init];
  NSString *isStorybookValue = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"isStorybook"];
  BOOL isStorybook = [isStorybookValue boolValue];
  
  [initialProperties setValue:[NSNumber numberWithBool:isStorybook] forKey:@"isStorybook"];
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"iola"
                                            initialProperties:initialProperties];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [RNSplashScreen show];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  NSString *isStorybookValue = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"isStorybook"];
  BOOL isStorybook = [isStorybookValue boolValue];
  NSString *bundleRoot = isStorybook ? @"storybook" : @"index";

  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:bundleRoot fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
