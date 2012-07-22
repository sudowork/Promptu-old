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

+(Prompt *) promptWithJSON:(NSMutableDictionary *)json {

    Prompt *newPrompt = [[[Prompt alloc] init] autorelease];
    newPrompt.uId = [json objectForKey:@"_id"];
    newPrompt.header = [json objectForKey:@"header"];
    newPrompt.body = [json objectForKey:@"body"];
    newPrompt.priority = [[json objectForKey:@"priority"] intValue];
    newPrompt.tags = [json objectForKey:@"tags"];
    if ([json objectForKey:@"duedate"] != (id)[NSNull null])
	newPrompt.dueDate = [NSDate dateWithTimeIntervalSince1970:[[json objectForKey:@"duedate"] intValue]];
    else {
	newPrompt.dueDate = nil;
    }
    return newPrompt;
}
@end
