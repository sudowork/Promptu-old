//
//  Prompt.m
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "Prompt.h"

@implementation Prompt

@synthesize uId, authorId, groupId, header, body, priority, tags, sendDate, dueDate, dismissed;

- (void)dealloc {
    [header release];
    [body release];
    [tags release];
    [sendDate release];
    [dueDate release];
    [super dealloc];
}

@end
