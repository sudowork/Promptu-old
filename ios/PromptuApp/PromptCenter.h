//
//  PromptCenter.h
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "Singleton.h"

@interface PromptCenter : Singleton

- (void) fetchPrompts:(long)userId
     withForceRefresh:(bool)refresh
	 withCallback:(void(^)(long userId, id result, NSError* error))callback;

@end
