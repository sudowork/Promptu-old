//
//  PromptViewController.m
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "PromptViewController.h"

#import "PrettyKit.h"
#import "MGScrollView.h"
#import "MGStyledBox.h"
#import "MGBoxLine.h"
#import "PromptCenter.h"
#import "PromptBox.h"
#import "Prompt.h"
#import "PrettyToolbar.h"
#import "Underscore.h"

@implementation PromptViewController

@synthesize prompts, promptIndex, promptBoxIndex, toolBar, title, gestureRecognizers;

- (void)dealloc{
    [prompts release];
    [promptIndex release];
    [promptBoxIndex release];
    [toolBar release];
    [gestureRecognizers release];
    [super dealloc];
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil {
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {

    }
    return self;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)newPromptNotification:(NSNotification *)notification {

//    Prompt *newPrompt = [[Prompt alloc] init];
//    newPrompt.uId = [notification.userInfo objectForKey:@"_id"];
//    newPrompt.header = [notification.userInfo objectForKey:@"header"];
//    newPrompt.body = [notification.userInfo objectForKey:@"body"];
//    newPrompt.priority = [[notification.userInfo objectForKey:@"priority"] intValue];
//    newPrompt.tags = [notification.userInfo objectForKey:@"tags"];
//    newPrompt.dueDate = [NSDate dateWithTimeIntervalSince1970:[[notification.userInfo objectForKey:@"duedate"] intValue]];
//    NSMutableArray *temp = [NSMutableArray arrayWithArray:self.prompts];
//    [temp addObject:newPrompt];
//    self.prompts = [NSArray arrayWithArray:temp];
//    [self refreshView];
//    [newPrompt release];


}


//// This is the core method you should implement
- (void)reloadDataSource {
    [super reloadDataSource];
    [(PromptCenter *)[PromptCenter sharedInstance] fetchPromptswithForceRefresh:YES
	withCB:^(id result, NSError* error) {
	 if(!error) {
	     NSLog(@"%@", result);
	     self.promptIndex = [[NSMutableDictionary alloc] initWithCapacity:1];
	     self.promptBoxIndex = [[NSMutableDictionary alloc] initWithCapacity:1];
//             self.prompts = [NSArray arrayWithArray:newPrompts];
	     self.prompts = [result sortedArrayUsingComparator:
				 ^NSComparisonResult(id a, id b) {
				     NSDate *first = [(Prompt*)a dueDate];
				     NSDate *second = [(Prompt*)b dueDate];
				     return [second compare: first];
			    }];
	     self.title = @"promptu";
	     [self refreshView];
	 } else {
	     NSLog(@"Pull to Sync Failed");
	 }
	[self performSelector:@selector(doneLoadingData)];
    }];
}

- (void)refreshView {
    [self.scroller.boxes removeAllObjects];
    for (Prompt *prompt in self.prompts) {
	[self.scroller.boxes addObject:[self.promptBoxIndex objectForKey:prompt.uId]];
    }
    [self.scroller drawBoxesWithSpeed:PROMPT_ANIM_SPEED];
    [self.scroller flashScrollIndicators];
}

//#pragma mark - UIScrollViewDelegate (for snapping boxes to edges)
//
//- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
//    if (!_reloading) {
//        [(MGScrollView *)scrollView snapToNearestBox];
//    }
//}
//
//- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView
//                  willDecelerate:(BOOL)decelerate {
//    if (!decelerate && !_reloading) {
//        [(MGScrollView *)scrollView snapToNearestBox];
//    }
//}

#pragma mark - View lifecycle

- (void)viewDidLoad {
    [super viewDidLoad];

    [(PromptCenter *)[PromptCenter sharedInstance] fetchPromptswithForceRefresh:YES
						    withCB:^(id result, NSError* error) {
	 if(!error) {
	 NSLog(@"%@", result);
	     self.promptIndex = [[NSMutableDictionary alloc] initWithCapacity:1];
	     self.promptBoxIndex = [[NSMutableDictionary alloc] initWithCapacity:1];
	 self.prompts = result;
	     [self refreshView];
	 } else {
	 NSLog(@"Initial Sync Failed");
     }
     }];

    [[NSNotificationCenter defaultCenter] addObserver:self
					     selector:@selector(newPromptNotification:)
						 name:NEW_PROMPT_PUSH
					       object:nil];

    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 400, 44)];
    label.backgroundColor = [UIColor clearColor];
    label.font = FONT_NAV;
    label.shadowColor = [UIColor colorWithWhite:0.0 alpha:0.5];
    label.textAlignment = UITextAlignmentCenter;
    label.textColor =[UIColor whiteColor];
    label.text=@"promptu";
    self.navigationItem.titleView = label;
    [self.navigationController.navigationBar setTitleVerticalPositionAdjustment:-3.0 forBarMetrics:UIBarMetricsDefault];
    [self.navigationItem.titleView sizeToFit];
    [label release];

    if ([self.navigationController.parentViewController respondsToSelector:@selector(revealGesture:)] && [self.navigationController.parentViewController respondsToSelector:@selector(revealToggle:)]) {
		UIPanGestureRecognizer *navigationBarPanGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self.navigationController.parentViewController action:@selector(revealGesture:)];
	UIPanGestureRecognizer *viewPanGestureRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self.navigationController.parentViewController action:@selector(revealGesture:)];
		[self.navigationController.navigationBar addGestureRecognizer:navigationBarPanGestureRecognizer];
	[self.view addGestureRecognizer:viewPanGestureRecognizer];

	self.gestureRecognizers = [NSArray arrayWithObjects:navigationBarPanGestureRecognizer, viewPanGestureRecognizer, nil];

    [navigationBarPanGestureRecognizer release];
	[viewPanGestureRecognizer release];

		self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"ButtonMenu"]  style:UIBarButtonItemStyleBordered target:self.navigationController.parentViewController action:@selector(revealToggle:)];
	}



    self.view.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:PROMPT_BACKGROUND]];
    self.scroller.backgroundColor = [UIColor clearColor];
    self.scroller.alwaysBounceVertical = YES;

    self.toolBar.topLineColor = [UIColor colorWithHex:0x00ADEE];
    self.toolBar.gradientStartColor = [UIColor colorWithHex:0x00ADEE];
    self.toolBar.gradientEndColor = [UIColor colorWithHex:0x0078A5];
    self.toolBar.bottomLineColor = [UIColor colorWithHex:0x0078A5];
    self.toolBar.tintColor = self.toolBar.gradientEndColor;
}

- (void)viewDidUnload {
    [super viewDidUnload]; // Always call superclass methods first, since you are using inheritance
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    return YES;
}

#pragma mark - PUPromptBoxDelegate

- (void)promptBoxDidExpand:(PromptBox *)promptBox {
    [self.scroller drawBoxesWithSpeed:0.0];
}

- (void)promptBoxDidCompress:(PromptBox *)promptBox {
    [self.scroller drawBoxesWithSpeed:PROMPT_ANIM_SPEED];
}

- (void)promptBoxDidDismiss:(PromptBox *)promptBox {
    ((Prompt *)[self.promptIndex objectForKey:promptBox.promptId]).dismissed = YES;
    [(PromptCenter *)[PromptCenter sharedInstance] updateDismissedState:YES forPrompt:promptBox.promptId];
    [self.scroller drawBoxesWithSpeed:PROMPT_ANIM_SPEED];
}

- (void)promptBoxDidUndismiss:(PromptBox *)promptBox {
    ((Prompt *)[self.promptIndex objectForKey:promptBox.promptId]).dismissed = NO;
    [(PromptCenter *)[PromptCenter sharedInstance] updateDismissedState:NO forPrompt:promptBox.promptId];
    [self.scroller drawBoxesWithSpeed:PROMPT_ANIM_SPEED];
}

- (void)promptBoxShowDetailed:(PromptBox *)promptBox {

}

#pragma mark - PUPromptBoxDataSource

- (Prompt *)promptWithId:(NSString *)promptId {
    return [self.promptIndex objectForKey:promptId];
}

#pragma mark - IBActions
- (IBAction)shufflePrompts:(id)sender {
    self.prompts = _array(self.prompts).shuffle.unwrap;
    [self refreshView];
}

- (IBAction)newPrompt:(id)sender {

}
- (IBAction)sortPrompts:(id)sender {

}

#pragma mark - UISearchBarDelegate

- (void)searchBarTextDidBeginEditing:(UISearchBar *)searchBar {
    [searchBar setShowsCancelButton:YES animated:YES];
//    searchBar.scopeButtonTitles = [NSArray arrayWithObjects:@"Header", @"Body", @"Tags", nil];
//    searchBar.showsScopeBar = YES;
    for (UIGestureRecognizer *gr in self.gestureRecognizers){
	gr.enabled = NO;
    }
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar {
    self.prompts = _array(self.prompts).filter(^BOOL (id obj) {
		if ([obj isKindOfClass:[Prompt class]]) {
		    if ([((Prompt *)obj).body rangeOfString:searchBar.text options:NSCaseInsensitiveSearch].location != NSNotFound)
		return YES;
	    if ([((Prompt *)obj).header rangeOfString:searchBar.text options:NSCaseInsensitiveSearch].location != NSNotFound)
		return YES;
	    for (NSString *s in ((Prompt *)obj).tags) {
		if ([s rangeOfString:searchBar.text options:NSCaseInsensitiveSearch].location != NSNotFound)
		    return YES;
	    }
		}
		return NO;
    }).unwrap;
    for (UIGestureRecognizer *gr in self.gestureRecognizers){
	gr.enabled = YES;
    }
    [searchBar setShowsCancelButton:NO animated:YES];
    [self refreshView];
    [searchBar resignFirstResponder];
}
- (void)searchBarCancelButtonClicked:(UISearchBar *)searchBar {
    [searchBar resignFirstResponder];
    [searchBar setShowsCancelButton:NO animated:YES];
    for (UIGestureRecognizer *gr in self.gestureRecognizers){
	gr.enabled = YES;
    }
//    searchBar.showsScopeBar = NO;
}

#pragma mark - Custom accessors

- (void)setPrompts:(NSArray *)newPrompts {
    [newPrompts copy];
    [prompts release];
    prompts = newPrompts;
    for (Prompt *prompt in self.prompts) {
	[self.promptIndex setObject:prompt forKey:prompt.uId];
	if (![self.promptBoxIndex objectForKey:prompt.uId]) {
	    PromptBox *box = [PromptBox promptBoxWithPromptId:prompt.uId];
	    box.delegate = self;
	    box.dataSource = self;
	    [self.promptBoxIndex setObject:box forKey:prompt.uId];
	}
    }
}

- (void)setTitle:(NSString *)aTitle {
    UILabel *titleLabel = ((UILabel *)self.navigationItem.titleView);
    titleLabel.text = aTitle;
    UIFont* font = titleLabel.font;
    CGSize constraintSize = CGSizeMake(titleLabel.frame.size.width, MAXFLOAT);
    CGSize labelSize = [titleLabel.text sizeWithFont:font constrainedToSize:constraintSize lineBreakMode:UILineBreakModeWordWrap];
//    titleLabel.frame = CGRectMake(titleLabel.frame.origin.x, titleLabel.frame.origin.y, titleLabel.frame.size.width, labelSize.height);
    titleLabel.frame = CGRectMake(titleLabel.frame.origin.x, titleLabel.frame.origin.y, 200, labelSize.height);
}






@end
