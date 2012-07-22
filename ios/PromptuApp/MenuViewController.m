//
//  MenuViewController.m
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "MenuViewController.h"

#import "PromptViewController.h"
#import "PromptCenter.h"
#import "Underscore.h"
#import "Prompt.h"


@implementation MenuViewController

@synthesize promptViewController;

- (void)dealloc {
    [promptViewController release];
    [super dealloc];
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
    }
    return self;
}

- (IBAction)home:(id)sender {
    [(PromptCenter *)[PromptCenter sharedInstance] fetchPromptswithForceRefresh:NO withCB: ^(id result, NSError* error) {
	if(!error) {
	    self.promptViewController.prompts = result;
	self.promptViewController.title = @"promptu";
	    [self.promptViewController refreshView];
	}
    }];
}

- (IBAction)pinned:(id)sender {

}

- (IBAction)checked:(id)sender {
    [(PromptCenter *)[PromptCenter sharedInstance] fetchPromptswithForceRefresh:NO withCB: ^(id result, NSError* error) {
	if(!error) {
	    self.promptViewController.prompts = _array(result).filter(^BOOL (id obj) {
		if ([obj isKindOfClass:[Prompt class]]) {
		    if (((Prompt *)obj).dismissed) {
			return YES;
		    }
		}
		return NO;
	    }).unwrap;
	self.promptViewController.title = @"dismissed";
	    [self.promptViewController refreshView];
	}
    }];
}

- (IBAction)overdue:(id)sender {

}

- (IBAction)dayPicker:(id)sender {
    [self.promptViewController shufflePrompts:nil];

}

- (IBAction)groups:(id)sender {

}

- (IBAction)settings:(id)sender {

}



#pragma mark - View lifecycle

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    self.promptViewController = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    return (interfaceOrientation == UIInterfaceOrientationPortrait);
}

@end
