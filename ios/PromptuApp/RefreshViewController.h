//
//  RefreshViewController.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "EGORefreshTableHeaderView.h"

#import "MGBoxProtocol.h"

@class MGScrollView;
@class MGBox;

@interface RefreshViewController : UIViewController <EGORefreshTableHeaderDelegate, UIScrollViewDelegate, UITableViewDelegate, UITableViewDataSource, UISearchBarDelegate>

@property (nonatomic, retain) EGORefreshTableHeaderView *refreshHeaderView;
@property (nonatomic, assign) BOOL reloading;
@property (nonatomic, retain) IBOutlet MGScrollView *scroller;

- (void)reloadDataSource;
- (void)addBox:(id<MGBoxProtocol>)aBox atIndex:(int)index;
- (void)addBox:(id<MGBoxProtocol>)aBox;



@end
