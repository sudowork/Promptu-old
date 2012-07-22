//
//  SignInViewController.m
//  Promptu
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "SignInViewController.h"

#import "PromptCenter.h"

@implementation SignInViewController

@synthesize username, password, backgroundView;

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

    [self.password addTarget:self
		      action:@selector(passwordDoneEditing:)
	    forControlEvents:UIControlEventEditingDidEndOnExit];
    self.password.autocapitalizationType = UITextAutocapitalizationTypeNone;
    self.username.autocorrectionType = UITextAutocorrectionTypeNo;
    self.password.secureTextEntry = YES;

}

- (void)viewDidUnload
{
    self.username = nil;
    self.password = nil;
    self.backgroundView = nil;
    [super viewDidUnload];
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

    [(PromptCenter *)[PromptCenter sharedInstance] signInWithUsername:self.username.text
							 withPassword:self.password.text
							 withCB:^(id result, NSError* error) {
							     if(!error) {
								 NSLog(@"Yay authenticated!");
							     } else {
								 NSLog(@"Error: auth failed");
							     }
    }];
}

- (void)backgroundTap:(id)sender {
    [self.username resignFirstResponder];
    [self.password resignFirstResponder];
}

@end
