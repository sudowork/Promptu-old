//
//  PromptCenter.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "Singleton.h"

@class PromptAPI;

@interface PromptCenter : Singleton

@property (nonatomic, copy) NSString *deviceToken;
@property (nonatomic, copy) NSString *uuid;
@property (nonatomic, retain) PromptAPI *api;

- (void)signInWithUsername:(NSString *)username
	      withPassword:(NSString *)password
	      withCB:(void(^)(id result, NSError* error))completionBlock;

- (void)fetchPromptswithForceRefresh:(bool)refresh
			withCB:(void(^)(id result, NSError* error))completionBlock;

@end
