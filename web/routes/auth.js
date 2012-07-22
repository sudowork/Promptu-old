var crypto = require('../lib/crypto');

/**
 * POST /auth
 * Returns a client token for a client to authenticate with per session
 * @param req req.body should equal {email: ..., password: ...}
 * @param res http response
 */
exports.auth = function (req, res) {
  var params = req.body;

  if (!exists(params.email) || !exists(params.password)) {
    E.send(res, 'VALIDATION_EXCEPTION', 'Need to provide email and password');
    return;
  }

  // Look for email and password combo
  Models.User.findOne({
    email: params.email.toLowerCase(),
  }, function (err, user) {
    if (err) { E.sendUnk(res, err); return; }
    // If user exists and password matches, update tokens and device + uuid
    if (user && crypto.checkPassword(params.password, user.password)) {
      // Modify devices (update token if uuid exists; otherwise add)
      if (exists(params.uuid) && exists(params.deviceToken)) {
        var found = false;
        _(user.devices).map(function (device) {
          if (device.uuid === params.uuid) {
            found = true;
            device.token = params.deviceToken;
            return device;
          }
        });
        // Add new device if not found
        if (!found) user.devices.push({uuid: params.uuid, token: params.deviceToken});
      }
      // Change session token
      var token = crypto.genClientToken(params.email);
      user.session = crypto.genSessionToken(token.token);
      user.save(function (err) {
        if (err) E.sendUnk(res, err);
      });
      res.send(token);
    } else {
      E.send(res, 'INVALID_CREDENTIALS');
    }
  });
}

/**
 * POST /signup
 * @param req req.body should contain at minimum email and password
 * @param res http response
 */
exports.signup = function (req, res) {
  var params = req.body;

  // Filter query relevant keys
  params = _(params).pick(
    'email',
    'password',
    'phone',
    'preferences',
    'groups',
    'devices'
  );

  if (exists(params.devices)) {
    try {
      params.devices = JSON.parse(params.devices);
    } catch (err) {
      E.send(res, 'VALIDATION_EXCEPTION', {devices: params.devices});
      return false;
    }
  }

  if (!exists(params.email) || !exists(params.password)){
    E.send(res, 'VALIDATION_EXCEPTION', 'Missing either email or password');
    return false;
  }
  // Validate password
  // TODO: Figure out more validation rules
  if (!/^[\w\W]{7,32}$/.test(params.password)) {
    E.send(res, 'VALIDATION_EXCEPTION', 'Invalid password');
    return false;
  }

  // Encrypt password using bcrypt
  params.password = crypto.bcrypt(params.password);

  // Look for existing user with same username (email)
  Models.User.findOne({
    email: params.email.toLowerCase()
  }, function (err, data) {
    if (err) { E.sendUnk(res, err); return; }
    if (data) { E.send(res, 'SIGNUP_EXCEPTION'); return; }
    // Create new user and change updated time
    var userParams = _.extend({}, params, {updated: Date.now()})
      , user = new Models.User(userParams);
    user.save(function (err) {
      if (err) {
        E.send(res, 'VALIDATION_EXCEPTION', err.errors);
      } else {
        res.send(201);
      }
    });
  });
}

exports.logout = function (req, res) {
  var userId = req.session.userId;
  Models.User.findOne({
    _id: userId
  }, function (err, user) {
    if (err) { E.sendUnk(res, err); return; }
    if (!user) { E.send(res, 'NOT_FOUND_EXCEPTION', {user: userId}); return; }
    user.session = '';
    user.sessionExp = new Date(0);
    user.save(function (err) {
      E.send(res, 'VALIDATION_EXCEPTION', err);
    });
    res.send(200);
  });
}

/**
 * Any request needing authentication needs to go through this internal endpoint
 * @param req http request needs to have sessionToken
 * @param res http response
 * @param next next route to call
 */
exports.session = function (req, res, next) {
  // @NOTE: can use session or query string. Used for testing.
  var sessionToken = req.session.sessionToken || req.body.sessionToken || req.query.sessionToken;
  if (!exists(sessionToken)) { E.send(res, 'SESSION_MISSING_EXCEPTION'); return; }
  Models.User.findOne({session: sessionToken})
    .populate('groups', ['_id', 'path'])
    .exec(function (err, user) {
      if (!user) { E.send(res, 'SESSION_INVALID_EXCEPTION', {session: sessionToken}); return; }
      // Check if session has expired
      if (new Date() > user.sessionExp) {
        E.send(res, 'SESSION_EXPIRED_EXCEPTION', {expired: user.sessionExp});
        return false;
      }
      // Store userid, and groups
      req.session.userId = user._id;
      req.session.userGroups = user.groups;
      next();
    });
};

