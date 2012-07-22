var config = {};

config.development = {
  vendorcss: [
    // 'css/bootstrap/bootstrap-responsive.css',
    'css/bootstrap/bootstrap.css',
    'css/fontawesome/font-awesome.css',
    'css/fontawesome/font-awesome-ie7.css'
  ],
  vendorjs: [
    'js/vendor/underscore.js',
    'js/vendor/backbone.js',
    'js/vendor/bootstrap/bootstrap.js',
    'js/vendor/bootstrap/alert.js',
    'js/vendor/bootstrap/button.js',
    'js/vendor/bootstrap/carousel.js',
    'js/vendor/bootstrap/collapse.js',
    'js/vendor/bootstrap/dropdown.js',
    'js/vendor/bootstrap/modal.js',
    'js/vendor/bootstrap/popover.js',
    'js/vendor/bootstrap/scrollspy.js',
    'js/vendor/bootstrap/tab.js',
    'js/vendor/bootstrap/tooltip.js',
    'js/vendor/bootstrap/transition.js',
    'js/vendor/bootstrap/typeahead.js'
  ],
  apnGateway: 'gateway.sandbox.push.apple.com'
};

config.production = {
  vendorcss: [
    'css/bootstrap/bootstrap-responsive.min.css',
    'css/bootstrap/bootstrap.min.css',
    'css/fontawesome/font-awesome.css',
    'css/fontawesome/font-awesome-ie7.css'
  ],
  vendorjs: [
    'js/vendor/underscore.min.js',
    'js/vendor/jquery-1.7.2.min.js',
    'js/vendor/backbone.min.js',
    'js/vendor/bootstrap/bootstrap.min.js'
  ],
  mongoUri: process.env.PROMPTU_PRODUCTION_MONGO_URI || 'mongodb://localhost/promptu',
  apnGateway: 'gateway.push.apple.com'
};

config.default = {
  secret: 'eUWEUVYKRvfxMaZNgY4Q7eWV',
  expressSecret: 'rEZvQxgarSw5LLZe6C94BmPr',
  sessionTimeout: 4,
  bcryptRounds: 10,
  mongoUri: process.env.PROMPTU_MONGO_URI || 'mongodb://localhost/promptu',
  apn: {
    cert: {
      path: '../res/apn/',
      cert: 'PromptuPushAppCert.pem',
      key: 'PromptuPushAppKey.pem',
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
  },
  appjs: [
    'js/model/prompt.js',
    'js/collection/prompts.js',
    'js/view/promptsview.js',
    'js/model/group.js',
    'js/collection/groups.js',
    'js/view/groupsview.js',
    'js/model/admin.js',
    'js/view/adminview.js',
    'js/controller/router.js'
  ],
	executorInterval: 8,
  email: {
    subjectPrefix: '[PromptU Notification] ',
    transport: {
      service: "Gmail",
      auth: {
        user: "promptuapp@gmail.com",
        pass: "6mbTkYe8uXcc"
      }
    },
    defaults: {
      sender: 'promptU App <notifier@promptuapp.com>',
      subject: 'New Notification from promptU',
      template: './public/templates/email.html'
    }
  }
};

module.exports = config;
