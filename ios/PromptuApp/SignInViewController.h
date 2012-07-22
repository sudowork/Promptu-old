//
//  SignInViewController.h
//  Promptu
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface SignInViewController : UIViewController<UITextFieldDelegate>

@property(nonatomic, retain) IBOutlet UITextField *username;
@property(nonatomic, retain) IBOutlet UITextField *password;
@property(nonatomic, retain) IBOutlet UIImageView *backgroundView;

- (IBAction)userNameDoneEditing:(id)sender;

- (IBAction)passwordDoneEditing:(id)sender;

@end
