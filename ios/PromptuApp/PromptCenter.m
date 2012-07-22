//
//  PromptCenter.m
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "PromptCenter.h"

#import "Prompt.h"
#import "UIDevice+IdentifierAddition.h"
#import "PromptAPI.h"

@implementation PromptCenter

@synthesize deviceToken, uuid, api;

- (id)init
{
    self = [super init];
    if (self) {
	uuid = [[UIDevice currentDevice] uniqueDeviceIdentifier];
	api = [[PromptAPI alloc] init];
    }
    return self;
}


- (void)signInWithUsername:(NSString *)username
	      withPassword:(NSString *)password
	      withCB:(void(^)(id result, NSError* error))completionBlock {

    NSMutableDictionary *params = [NSMutableDictionary dictionaryWithObjectsAndKeys:
				   username, @"email",
				   password, @"password",
				   @"yoyoyoyo", @"uuid",
				   self.deviceToken, @"deviceToken",  nil];

    [api commandWithMethod:@"POST" withPath:@"auth" withParams:params onCompletion:
     ^(NSDictionary * json) {
	 if([json objectForKey:@"error"]) {
	     completionBlock(nil, [json objectForKey:@"error"]);
	 } else {
	     completionBlock(json, nil);
	 }
     }];

}

- (void)fetchPromptswithForceRefresh:(bool)refresh
			withCB:(void(^)(id result, NSError* error))completionBlock {

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
    a.dueDate = [NSDate dateWithTimeIntervalSince1970:1343559306];
    a.dismissed = NO;
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
    b.dueDate = [NSDate dateWithTimeIntervalSince1970:1343132916];
    b.dismissed = YES;
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
    c.dueDate = [NSDate dateWithTimeIntervalSince1970:1343219316];
    c.dismissed = NO;
    [result addObject:c];
    [c release];

    completionBlock(result, nil);
}

@end
