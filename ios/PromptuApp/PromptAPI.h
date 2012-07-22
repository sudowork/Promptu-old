//
//  PromptAPI.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "AFHTTPClient.h"

@protocol PromptSessionDelegate;

typedef void (^JSONResponseBlock)(NSDictionary* json);

@interface PromptAPI : AFHTTPClient

@property(nonatomic, assign) id<PromptSessionDelegate> sessionDelegate;

-(void)commandWithMethod:(NSString *)method
		withPath:(NSString *)path
	      withParams:(NSMutableDictionary*)params
	    onCompletion:(JSONResponseBlock)completionBlock;

@end

////////////////////////////////////////////////////////////////////////////////

/**
 * Your application should implement this delegate to receive session callbacks.
 */
@protocol PromptSessionDelegate <NSObject>


- (void)sessionBegin;

- (void)sessionExpired;

@end
