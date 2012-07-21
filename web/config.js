var config = {};

config.development = {
};

config.production = {
};

config.default = {
  secret: 'eUWEUVYKRvfxMaZNgY4Q7eWV',
  sessionTimeout: 4,
  bcryptRounds: 10,
  mongoUri: process.env.PROMPTU_MONGO_URI || 'mongodb://localhost/promptu',
  apn: {
    cert: {
      path: '../res/push/',
      cert: 'PromptuPushCert.pem',
      key: 'PromptuPushKey.pem',
      //ca: 'aps_development.cer',
      passphrase: process.env.APN_PASSPHRASE,
    },
    options: {
      port: 2195,
      enhanced: true,
      errorCallback: function (err, notification) {
        console.log(err, notification);
      },
      cacheLength: 100
    }
  }
};

module.exports = config;
