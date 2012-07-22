//
//  PromptBox.m
//  PromptuApp
//
//  Created by Brandon Millman on 7/21/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "PromptBox.h"

#import "MGBoxLine.h"
#import "Prompt.h"
#import "BadgeLabel.h"
#import "UILabelStrikethrough.h"

#define DEFAULT_WIDTH          304.0
#define DEFAULT_TOP_MARGIN      10.0
#define DEFAULT_LEFT_MARGIN      8.0
#define CORNER_RADIUS            4.0

#define PRIORITY_ZERO 0
#define PRIORITY_ONE  1
#define PRIORITY_TWO  2

#define STATE_CLOSED 0
#define STATE_OPENED 1

@implementation PromptBox

@synthesize promptId, delegate, dataSource, expandState, headerLabel;

+ (id)promptBoxWithPromptId:(NSInteger)aPromptId
{
    CGRect frame = CGRectMake(DEFAULT_LEFT_MARGIN, 0, DEFAULT_WIDTH, 0);
    PromptBox *box = [[[self class] alloc] initWithFrame:frame];
    box.promptId = aPromptId;
    return box;
}

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
	expandState = STATE_CLOSED;

	// Hook up a tap gesture recognizer
	UITapGestureRecognizer *singleFingerTap =
	[[UITapGestureRecognizer alloc] initWithTarget:self
						action:@selector(handleTap:)];
	[self addGestureRecognizer:singleFingerTap];

	// Hook up a swipe gesture recognizer
	UILongPressGestureRecognizer *longPress =
	[[UILongPressGestureRecognizer alloc] initWithTarget:self
						      action:@selector(handleLongPress:)];
	[self addGestureRecognizer:longPress];
    }
    return self;
}

- (void)handleTap:(UITapGestureRecognizer *)sender {
    CGPoint point = [sender locationInView:sender.view];
    NSLog(@"%@", NSStringFromCGPoint(point));
    Prompt *prompt = [self.dataSource promptWithId:self.promptId];

    if (self.expandState == STATE_CLOSED) {

	MGBoxLine *body = [MGBoxLine multilineWithText:prompt.body font:nil padding:12];
	[self.topLines addObject:body];

	NSMutableArray *tagBadges = [[NSMutableArray alloc] init];

	for(NSString * tag in prompt.tags) {
	    BadgeLabel *badge = [[BadgeLabel alloc] initWithFrame:CGRectZero];
	    [badge setStyle:BadgeLabelStyleAppIcon];
	    [badge setText:tag];
	    [tagBadges addObject:badge];
	}


	UIButton *pinButton = [UIButton buttonWithType:UIButtonTypeCustom];
	[pinButton setImage:[UIImage imageNamed:@"icon-pushpin-grey"] forState:UIControlStateNormal];
	pinButton.frame = CGRectMake(0, 0, 20, 20);

	NSArray *buttons = [NSArray arrayWithObjects:[UIImage imageNamed:@"grey"], pinButton, nil];


	MGBoxLine *footer = [MGBoxLine lineWithLeft:tagBadges right:buttons];
	[self.topLines addObject:footer];
	self.expandState = STATE_OPENED;
	[self.delegate promptBoxDidExpand:self];

    } else if (self.expandState == STATE_OPENED) {
	if(point.x > 270 && point.x < 310 && point.y < 130 && point.y > 70){
	    [self.delegate promptBoxShowDetailed:self];
	} else {
	    MGBoxLine *first = [self.topLines objectAtIndex:0];
	    [self.topLines removeAllObjects];
	    [self.topLines addObject:first];
	    self.expandState = STATE_CLOSED;
	    [self.delegate promptBoxDidCompress:self];
	}
    }

}

- (void)handleLongPress:(UILongPressGestureRecognizer *)sender
{
    if (sender.state == UIGestureRecognizerStateBegan) {
	Prompt *prompt = [self.dataSource promptWithId:self.promptId];

	if (!prompt.dismissed) {
	    self.newAlpha = 0.5;
//        ((UILabelStrikethrough *)[[[self.topLines objectAtIndex:0] contentsLeft] objectAtIndex:1]).strokeColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:1];
//        [((UILabelStrikethrough *)[[[self.topLines objectAtIndex:0] contentsLeft] objectAtIndex:1]) setNeedsDisplay];
	    [self.delegate promptBoxDidDismiss:self];
	} else {
	    self.newAlpha = 1.0;
//        ((UILabelStrikethrough *)[[[self.topLines objectAtIndex:0] contentsLeft] objectAtIndex:1]).strokeColor = [UIColor colorWithRed:0 green:0 blue:0 alpha:0];
//        [((UILabelStrikethrough *)[[[self.topLines objectAtIndex:0] contentsLeft] objectAtIndex:1]) setNeedsDisplay];

	[self.delegate promptBoxDidUndismiss:self];
	}
    }

}

-(void)superExpand:(id)sender {
    Prompt *prompt = [self.dataSource promptWithId:self.promptId];
    MGBoxLine *body = [MGBoxLine multilineWithText:prompt.body font:nil padding:12];
    [self.topLines addObject:body];
    [self.delegate promptBoxDidExpand:self];

}

- (void)setDataSource:(id<PromptBoxDataSource>)aDataSource {
    dataSource = aDataSource;

    Prompt *prompt = [self.dataSource promptWithId:self.promptId];
    NSString *blockImage = nil;
    if (!prompt.dismissed) {
	switch (prompt.priority) {
	    case PRIORITY_ZERO:
	    blockImage = @"red";
	    break;
	    case PRIORITY_ONE:
	    blockImage = @"orange";
	    break;
	    case PRIORITY_TWO:
	    blockImage = @"green";
	    break;
	    default:
	    break;
	}
    } else {
	blockImage = @"grey";
    }

    self.headerLabel = [[UILabelStrikethrough alloc] initWithFrame:CGRectMake(0, 0, 100, 26)];
    self.headerLabel.text = prompt.header;
    self.headerLabel.font = FONT_BOLD;
    CGSize size = [self.headerLabel.text sizeWithFont:self.headerLabel.font];
    self.headerLabel.frame = CGRectMake(0, 0, size.width, 26);
    self.headerLabel.backgroundColor = [UIColor clearColor];

    NSArray *left = [NSArray arrayWithObjects:[UIImage imageNamed:blockImage], self.headerLabel, nil];

    MGBoxLine *header = [MGBoxLine lineWithLeft:left right:[prompt.dueDate distanceOfTimeInWordsFromNow]];
    header.rightFont = [UIFont fontWithName:@"HelveticaNeue-Light" size:14];
    //header.font = TITLE_FONT;
    [self.topLines addObject:header];
}

@end
