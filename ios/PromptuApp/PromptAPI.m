//
//  PromptAPI.m
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "PromptAPI.h"
#import "AFNetworking.h"

#define kHost @"http://promptuapp.com:80"

///////////////////////////////////////////////////////////////////////////////////////////////////

@implementation PromptAPI

@synthesize sessionDelegate;

-(PromptAPI*)init
{
    self = [super initWithBaseURL:[NSURL URLWithString:kHost]];

    if (self != nil) {
	[self registerHTTPOperationClass:[AFJSONRequestOperation class]];
	[self setDefaultHeader:@"Accept" value:@"application/json"];
    }

    return self;
}

- (void)commandWithMethod:(NSString *)method
		withPath:(NSString *)path
	      withParams:(NSMutableDictionary*)params
	    onCompletion:(JSONResponseBlock)completionBlock {


    NSMutableURLRequest *apiRequest = [self requestWithMethod:method
							    path:path
						      parameters:params];

    AFJSONRequestOperation* operation = [[AFJSONRequestOperation alloc] initWithRequest: apiRequest];
    [operation setCompletionBlockWithSuccess:^(AFHTTPRequestOperation *operation, id responseObject) {
	completionBlock(responseObject);
    } failure:^(AFHTTPRequestOperation *operation, NSError *error) {
	completionBlock([NSDictionary dictionaryWithObject:[error localizedDescription] forKey:@"error"]);
    }];

    [operation start];
}

@end
