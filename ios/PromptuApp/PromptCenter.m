//
//  PromptCenter.m
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "PromptCenter.h"

#import "Prompt.h"

@implementation PromptCenter

- (void) fetchPrompts:(long)userId
     withForceRefresh:(bool)refresh
	 withCallback:(void(^)(long userId, id result, NSError* error))callback {

    NSMutableArray *result = [NSMutableArray arrayWithCapacity:1];

    Prompt *a = [[Prompt alloc] init];
    a.uId = 3423432;
    a.authorId = 2342342;
    a.groupId = 23434;
    a.header = @"Walk the dog";
    a.body = @"sdlfiewufiuw3ksdbfkudsfusdbsd";
    a.priority = 0;
    a.tags = [[NSArray alloc] initWithObjects:@"yee", @"yolo", @"rawdog", nil];
    a.sendDate = [NSDate dateWithTimeIntervalSince1970:1308031456];
    a.dueDate = [NSDate dateWithTimeIntervalSince1970:1309000000];
    a.dissmissed = NO;

    [result addObject:a];
    [a release];

    Prompt *b = [[Prompt alloc] init];
    b.uId = 34234323;
    b.authorId = 2342342;
    b.groupId = 23434;
    b.header = @"ECE256 Test";
    b.body = @"blah blah dsfsdf dfsdfsd iujfoijsadfoisjd ewhiwueh9348kdjv";
    b.priority = 2;
    b.tags = [[NSArray alloc] initWithObjects:@"blah", @"yo", @"dho", nil];
    b.sendDate = [NSDate dateWithTimeIntervalSince1970:1309000000];
    b.dueDate = [NSDate dateWithTimeIntervalSince1970:23423423432];
    b.dissmissed = NO;

    [result addObject:b];
    [b release];

    Prompt *c = [[Prompt alloc] init];
    c.uId = 3423434;
    c.authorId = 2342342;
    c.groupId = 23434;
    c.header = @"Homework";
    c.body = @"yksdjfuskfuhdskufhsd dsfjasdfkjsadhfo dsfasdfsdaf qewrwqe gtyjyu rffewrfwerfer";
    c.priority = 1;
    c.tags = [[NSArray alloc] initWithObjects:@"blah", @"hw", @"dho", nil];
    c.sendDate = [NSDate dateWithTimeIntervalSince1970:1309000000];
    c.dueDate = [NSDate dateWithTimeIntervalSince1970:23423423432];
    c.dissmissed = NO;

    [result addObject:c];
    [c release];

    callback(42342342, result, nil);
}

@end
