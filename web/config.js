var config = {};

config.development = {
  vendorcss: [
    'css/bootstrap/bootstrap-responsive.css',
    'css/bootstrap/bootstrap.css'
  ],
  vendorjs: [
    'js/vendor/underscore.js',
    'js/vendor/jquery-1.7.2.js',
    'js/vendor/backbone.js',
    'js/vendor/bootstrap/bootstrap.js'
  ]
};

config.production = {
  vendorcss: [
    'css/bootstrap/bootstrap-responsive.min.css',
    'css/bootstrap/bootstrap.min.css'
  ],
  vendorjs: [
    'js/vendor/underscore.min.js',
    'js/vendor/jquery-1.7.2.min.js',
    'js/vendor/backbone.min.js',
    'js/vendor/bootstrap/bootstrap.min.js'
  ]
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
      passphrase: process.env.APN_PASSPHRASE
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
