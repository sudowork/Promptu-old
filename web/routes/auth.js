var crypto = require('../lib/crypto');

/**
 * POST /auth
 * Returns a client token for a client to authenticate with per session
 * @param req req.body should equal {email: ..., password: ...}
 * @param res http response
 */
exports.auth = function (req, res) {
  var params = req.body;

  // Anon function that updates the session token
  var updateDbSessionToken = function (userid, clientToken) {
    var query = {_id: userid}
      , change = {session: crypto.genSessionToken(clientToken)};
    Models.User.update(
      query,
      {$set: change},
      {}, // options
      function (err) {
        if (err) E.sendUnk(res, err);
    });
  };

  if (!exists(params.email) || !exists(params.password)) {
    E.send(res, 'VALIDATION_EXCEPTION', 'Need to provide email and password');
    return;
  }

  // Look for email and password combo
  Models.User.findOne({
    email: params.email.toLowerCase(),
  }, function (err, user) {
    if (err) { E.sendUnk(res, err); return; }
    // If user exists and password matches, send client session token
    if (user && crypto.checkPassword(params.password, user.password)) {
      var token = crypto.genClientToken(params.email);
      updateDbSessionToken(user._id, token);
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
    'preferences'
  );

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

