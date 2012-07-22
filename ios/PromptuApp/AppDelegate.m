//
//  AppDelegate.m
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "AppDelegate.h"

#import "PromptViewController.h"
#import "MenuViewController.h"
#import "RevealController.h"
#import "PrettyKit.h"
#import "SignInViewController.h"
#import "PromptCenter.h"

@implementation AppDelegate

@synthesize window = _window;
@synthesize viewController = _viewController;

- (void)dealloc
{
    [_window release];
    [_viewController release];
    [super dealloc];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    UIWindow *window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
	self.window = window;

    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:(UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert)];

    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleBlackOpaque animated:NO];

    if ([launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey]) {
	NSLog(@"AYo");
	PromptViewController* frontViewController = [[PromptViewController alloc] initWithNibName:@"PromptViewController" bundle:nil];
	frontViewController.title = @"promptu";
    [frontViewController reloadDataSource];
	MenuViewController *rearViewController = [[MenuViewController alloc] initWithNibName:@"MenuViewController" bundle:nil];
	rearViewController.promptViewController = frontViewController;
	UINib *nib = [UINib nibWithNibName:@"NavBar" bundle:nil];
	UINavigationController *navigationController = [[nib instantiateWithOwner:nil options:nil] objectAtIndex:0];

	[navigationController pushViewController:frontViewController animated:NO];

	PrettyNavigationBar *navBar = (PrettyNavigationBar *)navigationController.navigationBar;

	navBar.topLineColor = [UIColor colorWithHex:0x00ADEE];
	navBar.gradientStartColor = [UIColor colorWithHex:0x00ADEE];
	navBar.gradientEndColor = [UIColor colorWithHex:0x0078A5];
	navBar.bottomLineColor = [UIColor colorWithHex:0x0078A5];
	navBar.tintColor = navBar.gradientEndColor;

	RevealController *revealController = [[RevealController alloc] initWithFrontViewController:navigationController rearViewController:rearViewController];
	self.viewController = revealController;
    } else {
	SignInViewController *signInController = [[SignInViewController alloc] initWithNibName:@"SignInViewController" bundle:nil];
	self.viewController = signInController;
    }

	self.window.rootViewController = self.viewController;
	[self.window makeKeyAndVisible];
	return YES;
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
    [[NSNotificationCenter defaultCenter] postNotificationName:NEW_PROMPT_PUSH object:self userInfo:userInfo];
}

- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {

    NSString *str = [NSString stringWithFormat:@"%@",deviceToken];
    NSString *newString = [str stringByReplacingOccurrencesOfString:@" " withString:@""];
    newString = [newString stringByReplacingOccurrencesOfString:@"<" withString:@""];
    newString = [newString stringByReplacingOccurrencesOfString:@">" withString:@""];



    NSLog(@"Your deviceToken ---> %@",newString);

    ((PromptCenter *)[PromptCenter sharedInstance]).deviceToken = newString;
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
    NSLog(@"Error: Cannot receive push notifs");

}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
