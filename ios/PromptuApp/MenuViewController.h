//
//  MenuViewController.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <UIKit/UIKit.h>

@class PromptViewController;

@interface MenuViewController : UIViewController

@property (nonatomic, retain) PromptViewController *promptViewController;

- (IBAction)home:(id)sender;
- (IBAction)groups:(id)sender;
- (IBAction)pinned:(id)sender;
- (IBAction)checked:(id)sender;

@end