var exceptions = {
  API_EXCEPTION: {
    code: 500,
    msg: 'Unknown API exception'
  },
  INVALID_CREDENTIALS: {
    code: 403,
    msg: 'Invalid authorization credentials'
  },
  VALIDATION_EXCEPTION: {
    code: 400,
    msg: 'Malformed inputs'
  },
  NOT_FOUND_EXCEPTION: {
    code: 404,
    msg: 'Requested object could not be found'
  },
  SIGNUP_EXCEPTION: {
    code: 409,
    msg: 'Could not create user because user already exists'
  },
  SESSION_EXPIRED_EXCEPTION: {
    code: 403,
    msg: 'Session has expired; request a new session token'
  },
  SESSION_MISSING_EXCEPTION: {
    code: 403,
    msg: 'Need to provide session token in sessionToken param'
  },
  SESSION_INVALID_EXCEPTION: {
    code: 403,
    msg: 'Session has either expired or is invalid'
  }
}

// Extend exports with exceptions and exception handling functions
module.exports = _.extend({}, exceptions, {
  // Sends an exception as an HTTP response
  send: function (res, e, info) {
    var exception = this[e] || this.API_EXCEPTION;  // Default to API_EXCEPTION

    if (exists(exception)) {
      if (exists(info)) exception.info = info;
      console.log("Exception in API", exception);
      res.json(exception, exception.code);
    }
  },

  // Easier method call to send an exception when you don't know the type
  sendUnk: function (res, info) { this.sendE(res, null, info) }
});

