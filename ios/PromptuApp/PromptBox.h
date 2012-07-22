//
//  PromptBox.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "MGStyledBox.h"

@class Prompt;

@protocol PromptBoxDelegate, PromptBoxDataSource;

@interface PromptBox : MGStyledBox

@property (nonatomic, assign) NSInteger promptId;
@property (nonatomic, assign) id<PromptBoxDelegate> delegate;
@property (nonatomic, assign) id<PromptBoxDataSource> dataSource;
@property (nonatomic, assign) int expandState;

+ (id)promptBoxWithPromptId:(NSInteger)aPromptId;

@end

@protocol PromptBoxDelegate <NSObject>

@required
- (void)promptBoxDidExpand:(PromptBox *)promptBox;
- (void)promptBoxDidCompress:(PromptBox *)promptBox;
- (void)promptBoxDidDissmiss:(PromptBox *)promptBox;
- (void)promptBoxDidUndissmiss:(PromptBox *)promptBox;
- (void)promptBoxShowDetailed:(PromptBox *)promptBox;


@end

@protocol PromptBoxDataSource <NSObject>

@required
- (Prompt *)promptWithId:(NSInteger)promptId;

@end
