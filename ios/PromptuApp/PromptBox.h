//
//  PromptBox.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "MGStyledBox.h"

@class Prompt, UILabelStrikethrough;
@protocol PromptBoxDelegate, PromptBoxDataSource;

@interface PromptBox : MGStyledBox

@property (nonatomic, assign) NSInteger promptId;
@property (nonatomic, assign) id<PromptBoxDelegate> delegate;
@property (nonatomic, assign) id<PromptBoxDataSource> dataSource;
@property (nonatomic, assign) int expandState;
@property (nonatomic, retain) UILabelStrikethrough *headerLabel;

+ (id)promptBoxWithPromptId:(NSInteger)aPromptId;

@end

@protocol PromptBoxDelegate <NSObject>

@required
- (void)promptBoxDidExpand:(PromptBox *)promptBox;
- (void)promptBoxDidCompress:(PromptBox *)promptBox;
- (void)promptBoxDidDismiss:(PromptBox *)promptBox;
- (void)promptBoxDidUndismiss:(PromptBox *)promptBox;
- (void)promptBoxShowDetailed:(PromptBox *)promptBox;


@end

@protocol PromptBoxDataSource <NSObject>

@required
- (Prompt *)promptWithId:(NSInteger)promptId;

@end
