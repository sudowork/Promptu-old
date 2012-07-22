/**
 * Push Executor
 *    _=__________________________-
 *   /  ////  (____)  P U S H____ |========================================O
 *  _|_////_________________(____|       |                                |
 *     )/  o  /) /  )/                   |                                |
 *    (/     /)__\_))                    |             PROMPT             |
 *   (/     /)                   ________|            --------            |________
 *  (/     /)                   |        |                                |        |
 * (/_ o _/)                    |        |________________________________|        |
 * --------                     |        \###|                        |###/        |
 *                              |         \##|                        |##/         |
 *                              |          \#|                        |#/          |
 *                              |___________\|                        |/___________
 */

// Set up config so that it's compatible with the app's use of apn
var env = process.env.NODE_ENV;
env = (typeof env === 'undefined') ? 'development' : env;
var fullConfig = require('../config');
_ = require('underscore');
config = _.defaults(fullConfig[env], fullConfig.default);
exists = function(obj) { return (typeof obj !== 'undefined'); };
existsOrElse = function(obj, def) { return (exists(obj)) ? obj : def; };

// Import apn dependencies
var apn = require('../lib/apn')
  , Device = require('apn').Device
  , Notification = require('apn').Notification
  , Feedback = require('apn').Feedback;

// Set up mongoose/MongoDB
mongoose = require('mongoose')
  , Models = require('../models/models');
mongoose.connect(config.mongoUri);

// Use some functions from group route
var groupFuncts = require('../routes/group');

/**
 * Channel-based action for sending prompt
 */
var channelToAction = {
  apn: function (user, prompt) {
    // Remove _id key/value pair
    var promptPayload = {}
      , devices = user.devices;
    var promptPayload = _(prompt).pick(
        'id_',
        'header',
        'body',
        'priority',
        'duedate',
        'tags'
    );
    // Convert duedate to seconds since epoch
    if (exists(promptPayload.duedate)) { promptPayload.duedate = promptPayload.duedate / 1000; }
    // Send notification to device
    _(devices).each(function (d) {
      var device = new Device(d.token)
        , notif = new Notification();
      notif.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
      notif.alert = prompt.header;
      notif.device = device;
      notif.payload = {'messageFrom': 'PromptU'};
      // Add custom data to payload
      _.extend(notif.payload, promptPayload);

      console.log('APN:', user.email, d.token, prompt.header);
      apn.sendNotification(notif);
    });
  },
  email: function (user, prompt) {
    console.log('Email:', user.email, prompt.header);
    var mail = require('../lib/mail');
    mail.send({
      to: user.email,
      subject: config.email.subjectPrefix + prompt.header,
      data: {
        subject: prompt.header,
        header_image: 'foo',
        tw_profile_link: 'foo',
        fb_profile_link: 'foo',
        year: new Date().getFullYear(),
        company_name: 'PromptU',
        unsub_link: 'foo',
        update_profile_link: 'foo'
      }
    });
  },
  sms: function (phone, prompt) {
  }
};

/**
 * Callback functions
 */
function performActionOnAllChildren (prompt, cb) {
  // All descendents
  var groupid = prompt.group
    , r = new RegExp(groupid + '(,|$)' )
    , query = {$or: [{path: r}]};
  if (root) query.$or.push({_id: groupid});

  Models.Group.find(query, function (err, groups) {
    if (err) {
      console.log(err);
    } else {
      cb(groups, prompt);
    }
  });
}

function actOnContactInfo (userids, prompt, cb) {
  Models.User.find(
    {_id: {$in: userids}}
  , function (err, users) {
    // Pass user emails, phone number, and devices to the callback
    cb(
      _(users).map(function (user) {
        return _(user).pick(
          '_id',
          'email',
          'phone',
          'devices'
        );
      }),
      prompt
    );
  });
}

function sendNotificationsToUsers(users, prompt) {
  _(users).each(function (user) {
    _(prompt.channels).each(function (chan) {
      channelToAction[chan](user, prompt);
    });
  });
}

function actOnUniqueMembers (groups, prompt) {
  // Get unique member list
  var users = _.chain(groups)
    .map(function (group) {
      return group.members;
    })
    .flatten()
    .value();
  // Remove users without view permission (really shouldn't be
  //   any), and then transform into only id's
  users = _.chain(users)
    .filter(function (user) {
      return user.permissions.indexOf('read') >= 0;
    })
    .map(function (user) {
      return user.user;
    })
    .uniq()
    .value();
  actOnContactInfo(users, prompt, sendNotificationsToUsers);
}

/**
 * Main processing function
 */
function processPrompts() {
  var time = new Date();
  // Find prompts to send. Must fit the following conditions
  // 1. sent == false     (i.e. unsent)
  // 2. sendtime DNE || sendtime <= time  (i.e. specified sendtime has already been
  //      reached)
  // 3. expiration DNE || expiration > time (i.e. not expired)
  query = {
    $and: [
      {sent: false},
      {$or: [
        {sendtime: {$exists: false}},
        {sendtime: {$lte: time}}
      ]},
      {$or: [
        {expiration: {$exists: false}},
        {expiration: {$gt: time}}
      ]}
    ]
  };
  Models.Prompt.find(
    query
  , function (err, prompts) {
    // Send message to all unique members of groups
    _(prompts).each(function (p) {
      performActionOnAllChildren(p, actOnUniqueMembers);
      p.sent = true;
      p.save(function (err) {
        if (err) console.log(err);
      });
    });
    // NOTE: callback chain:
    // performActionOnAllChildren -> actOnUniqueMembers -> sendNotificationsToUsers
  });
}

processPrompts();
setInterval(processPrompts, config.executorInterval*1000);

