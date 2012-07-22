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
#import "NSString+Helper.h"

@implementation PromptCenter

@synthesize deviceToken, uuid, api, promptCache, sessionToken;

- (id)init
{
    self = [super init];
    if (self) {
	[[NSNotificationCenter defaultCenter] addObserver:self
						 selector:@selector(newPromptNotification:)
						     name:NEW_PROMPT_PUSH
						   object:nil];
    }
    return self;
}

- (void)newPromptNotification:(NSNotification *)notification {
//    if (!self.promptCache) {
//        self.promptCache = [[NSMutableArray alloc] initWithCapacity:1];
//    }
//    Prompt *newPrompt = [[Prompt alloc] init];
//    newPrompt.uId = [notification.userInfo objectForKey:@"_id"];
//    newPrompt.header = [notification.userInfo objectForKey:@"header"];
//    newPrompt.body = [notification.userInfo objectForKey:@"body"];
//    newPrompt.priority = [[notification.userInfo objectForKey:@"priority"] intValue];
//    newPrompt.tags = [notification.userInfo objectForKey:@"tags"];
//    newPrompt.dueDate = [NSDate dateWithTimeIntervalSince1970:[[notification.userInfo objectForKey:@"duedate"] intValue]];
//
//    [self.promptCache addObject:newPrompt];
//    [newPrompt release];
//    NSLog(@"Contents of Notif: %@", notification.userInfo);
}



- (void)signInWithUsername:(NSString *)username
	      withPassword:(NSString *)password
	      withCB:(void(^)(id result, NSError* error))completionBlock {

//////////////////////////////////////////////////////////////////////////
    self.uuid = [[UIDevice currentDevice] uniqueDeviceIdentifier];
    self.api = [[PromptAPI alloc] init];
//////////////////////////////////////////////////////////////////////////

    NSMutableDictionary *params = [NSMutableDictionary dictionaryWithObjectsAndKeys:
				   username, @"email",
				   password, @"password",
				   uuid, @"uuid",
				   self.deviceToken, @"deviceToken",  nil];

    [api commandWithMethod:@"POST" withPath:@"auth" withParams:params onCompletion:
     ^(NSDictionary * json) {
	 if([json objectForKey:@"error"]) {
	     completionBlock(nil, [json objectForKey:@"error"]);
	 } else {
	 self.sessionToken = [[NSString stringWithFormat:@"%@%@", [json objectForKey:@"token"], API_SECRET] sha1];
	     completionBlock(json, nil);
	 }
     }];

}

- (void)fetchPromptswithForceRefresh:(bool)refresh
			withCB:(void(^)(id result, NSError* error))completionBlock {

    if(refresh || [self.promptCache count] == 0){
	NSString *path = [NSString stringWithFormat:@"/prompt/sync?sessionToken=%@", self.sessionToken];
	[api commandWithMethod:@"GET" withPath:path withParams:nil onCompletion:
	 ^(NSDictionary * json) {
	     if([json objectForKey:@"error"]) {
		 completionBlock(nil, [json objectForKey:@"error"]);
	     } else {
		 //self.promptCache = json;
		 NSMutableArray *newPrompts = [NSMutableArray arrayWithCapacity:1];
		 for (NSMutableDictionary *dict in [json objectForKey:@"yolo"]) {
		     [newPrompts addObject:[Prompt promptWithJSON:dict]];
		 }
		 self.promptCache = [NSArray arrayWithArray:newPrompts];
		 completionBlock(self.promptCache, nil);
	     }
	 }];
	return;
    }
    completionBlock(self.promptCache, nil);
}

- (void)updateDismissedState:(bool)state forPrompt:(NSString *)promptId {
    for (Prompt *p in self.promptCache) {
	if ([p.uId isEqualToString:promptId]) {
	    p.dismissed = state;
	    break;
	}
    }
}


@end
