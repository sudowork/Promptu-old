// Get configuration and read cert and key as buffers
var apn = require('apn')
  , certConf = config.apn.cert
  , options = _.chain(certConf)
    .pick('passphrase')
    .extend({}, config.apn.options, {
      cert: certConf.path + certConf.cert,
      key: certConf.path + certConf.key,
      gateway: config.apnGateway
    })
    .value();

module.exports = new apn.Connection(options);

