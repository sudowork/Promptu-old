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

@property (nonatomic, copy) NSString* uId;
@property (nonatomic, copy) NSString* authorId;
@property (nonatomic, copy) NSString* groupId;
@property (nonatomic, copy) NSString* header;
@property (nonatomic, copy) NSString* body;
@property (nonatomic, assign) int priority;
@property (nonatomic, copy) NSArray* tags;
@property (nonatomic, copy) NSDate* sendDate;
@property (nonatomic, copy) NSDate* dueDate;
@property (nonatomic, assign) bool dismissed;

+(Prompt *) promptWithJSON:(NSMutableDictionary *)json;

@end