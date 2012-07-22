//
//  SignInViewController.m
//  Promptu
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "SignInViewController.h"

#import "PromptCenter.h"
#import "PromptViewController.h"
#import "MenuViewController.h"
#import "PrettyKit.h"
#import "RevealController.h"

@implementation SignInViewController

@synthesize username, password, backgroundView, progressHud;

- (void)dealloc {
    [username release];
    [password release];
    [backgroundView release];
    [super dealloc];
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    UITapGestureRecognizer *singleTap =
    [[UITapGestureRecognizer alloc] initWithTarget:self
					    action:@selector(backgroundTap:)];
    [self.backgroundView addGestureRecognizer:singleTap];

    [self.username addTarget:self
		       action:@selector(userNameDoneEditing:)
	     forControlEvents:UIControlEventEditingDidEndOnExit];
    self.username.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.username.autocorrectionType = UITextAutocorrectionTypeNo;
    self.username.alpha = 0;

    [self.password addTarget:self
		      action:@selector(passwordDoneEditing:)
	    forControlEvents:UIControlEventEditingDidEndOnExit];
    self.password.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.username.autocorrectionType = UITextAutocorrectionTypeNo;
    self.password.secureTextEntry = YES;
    self.password.alpha = 0;


}

- (void)viewDidUnload
{
    self.username = nil;
    self.password = nil;
    self.backgroundView = nil;
    [super viewDidUnload];
}

- (void)viewDidAppear:(BOOL)animated
{
    [UIView beginAnimations: @"Fade In" context:nil];

    [UIView setAnimationDelay:1];
    [UIView setAnimationDuration:1];
    self.username.alpha = 1;
    self.password.alpha = 1;
    [UIView commitAnimations];
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

- (IBAction)userNameDoneEditing:(id)sender {
    [sender resignFirstResponder];
    [self.password becomeFirstResponder];
}

- (IBAction)passwordDoneEditing:(id)sender {
    [sender resignFirstResponder];

    self.progressHud = [[MBProgressHUD alloc] initWithView:self.view.window];
    self.progressHud.delegate = self;
    self.progressHud.dimBackground = YES;
	[self.view.window addSubview:self.progressHud];
    [self.progressHud show:YES];


    [(PromptCenter *)[PromptCenter sharedInstance] signInWithUsername:self.username.text
							 withPassword:self.password.text
							 withCB:^(id result, NSError* error) {
							     if(!error) {
				     NSLog(@"Login Success");

				     [self.progressHud hide:YES];

				     PromptViewController* frontViewController = [[PromptViewController alloc] initWithNibName:@"PromptViewController" bundle:nil];
				     frontViewController.title = @"Promptu";
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

				     UIViewAnimationTransition trans = UIViewAnimationTransitionFlipFromRight;
				     [UIView beginAnimations: nil context: nil];
				     [UIView setAnimationTransition: trans forView: self.view.window cache: YES];
				     [self presentModalViewController: revealController animated: NO];
				     [UIView commitAnimations];

				     [frontViewController release];
				     [rearViewController release];
				     [rearViewController release];

							     } else {
				     NSLog(@"Login Error");
				     self.progressHud.mode = MBProgressHUDModeCustomView;
				     self.progressHud.labelText = @"Try Again!";
				     [self.progressHud hide:YES afterDelay:2];
				 }

    }];
}

- (void)backgroundTap:(id)sender {
    [self.username resignFirstResponder];
    [self.password resignFirstResponder];
}

#pragma mark  - MBProgressHUDDelegate methods

- (void)hudWasHidden:(MBProgressHUD *)hud {
	// Remove HUD from screen when the HUD was hidded
	[self.progressHud removeFromSuperview];
	[self.progressHud release];
	self.progressHud = nil;
}

@end
