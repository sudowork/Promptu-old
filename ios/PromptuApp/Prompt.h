//
//  Prompt.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <Foundation/Foundation.h>

@interface Prompt : NSObject

@property (nonatomic, assign) NSInteger uId;
@property (nonatomic, assign) NSInteger authorId;
@property (nonatomic, assign) NSInteger groupId;
@property (nonatomic, copy) NSString* header;
@property (nonatomic, copy) NSString* body;
@property (nonatomic, assign) int priority;
@property (nonatomic, copy) NSArray* tags;
@property (nonatomic, copy) NSDate* sendDate;
@property (nonatomic, copy) NSDate* dueDate;
@property (nonatomic, assign) bool dissmissed;

@end