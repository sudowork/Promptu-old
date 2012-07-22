//
//  PromptViewController.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "RefreshViewController.h"

#import <UIKit/UIKit.h>
#import "PromptBox.h"
#import "MGBoxProtocol.h"
@class PrettyToolbar;

@interface PromptViewController : RefreshViewController <PromptBoxDelegate, PromptBoxDataSource>

@property (nonatomic, copy) NSArray *prompts;
@property (nonatomic, retain) NSMutableDictionary *promptIndex;
@property (nonatomic, retain) NSMutableDictionary *promptBoxIndex;
@property (nonatomic, retain) IBOutlet PrettyToolbar *toolBar;
@property (nonatomic, copy) NSString *title;
@property (nonatomic, retain) NSArray *gestureRecognizers;

- (void)refreshView;
- (IBAction)shufflePrompts:(id)sender;
- (IBAction)newPrompt:(id)sender;
- (IBAction)sortPrompts:(id)sender;


@end