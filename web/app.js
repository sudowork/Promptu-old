
/**
 * Module dependencies.
 */

var fs = require('fs')
  , express = require('express')
  , http = require('http')
  , exec = require('./exec')
  , routes = require('./routes')  // Loads from index.js route already
  , config = require('./config')
  ;

/**
 * Globals
 */
_ = require('underscore');
app = express();
E = require('./lib/exception');
exists = function(obj) { return (typeof obj !== 'undefined'); };
existsOrElse = function(obj, def) { return (exists(obj)) ? obj : def; };

/**
 * Compile Less files
 */
(function () {
  var cssDir = 'public/css'
    , path, cmd;
  _.chain(fs.readdirSync(cssDir))
    .filter(function (file) {
      // return (/^[a-zA-Z0-9\-_\.]+\.less/).test(file);
      return (/^style\.less/).test(file);
    })
    .each(function (file) {
      path = cssDir + '/' + file;
      console.log('Compiling LESS file ' + path);
      cmd = 'lessc ' + path + ' > ' + path.replace('less', 'css');
      exec(cmd);
    });
}());

/**
 * Prepare Underscore Templates
 */
(function () {
  var templatesDir = 'public/templates';
  config.default.templates = _.chain(fs.readdirSync(templatesDir))
    .filter(function (file) {
      return (/^[\w\-\.]+\.html$/).test(file);
    })
    .reduce(function (memo, file) {
      console.log('Loading template ' + file);
      memo[file.slice(0, -5)] = fs.readFileSync(templatesDir + '/' + file).toString();
      return memo;
    }, {})
    .value();
}());


app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: config.default.expressSecret}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
  app.set('config', _.defaults(config.development, config.default));
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.set('config', _.defaults(config.production, config.default));
  app.use(express.errorHandler());
});

// Alias app.settings.config to config
config = app.settings.config;

/**
 * Mongoose/MongoDB Setup
 */
mongoose = require('mongoose');
mongoose.connect(config.mongoUri);
Models = require('./models/models');

/**
 * Routes
 */

// Load all routes in ./routes/
var routes = _.chain(fs.readdirSync('routes/'))
  .filter(function (file) {
    return (/^[\w\-\.]+\.js$/).test(file);
  })
  .reduce(function (memo, file) {
    console.log('Loading route ' + file);
    var newRoute = require('./routes/' + file.slice(0, -3));
    return _.extend(memo, newRoute);
  }, {})
  .value();

app.get('/', routes.index);
app.get('/login', routes.login);

app.post('/auth', routes.auth);
app.post('/signup', routes.signup);

app.post('/prompt/create', routes.session, routes.createPrompt);
app.get('/prompt/sync', routes.session, routes.syncPrompts);

app.get('/group/:id', routes.session, routes.getGroup);
app.get('/group/tree/:id', routes.session, routes.getGroupTree);
app.post('/group/create', routes.session, routes.createGroup);
app.post('/group/member', routes.session, routes.addMemberToGroup);
app.del('/group/delete/:id', routes.session, routes.deleteGroup);

/**
 * Initialize Server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
