
/**
 * Module dependencies.
 */

var fs = require('fs')
  , express = require('express')
  , http = require('http')
  , exec = require('./exec')
  , routes = require('./routes')  // Loads from index.js route already
  , fs = require('fs')
  , config = require('./config');

/**
 * Globals
 */
_ = require('underscore');

var app = express();

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
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
// TODO: Add models as a global

/**
 * Routes
 */

// Load all routes in ./routes/
var routes = _.chain(fs.readdirSync('routes/'))
  .filter(function  ( file) {
    return (/^[\w\-\.]+\.js$/).test(file);
  })
  .reduce(function  ( memo, file) {
    console.log('Loading route ' + file);
    var newRoute = require('./routes/' + file.slice(0, -3));
    return _.extend(memo, newRoute);
  }, {})
  .value();

app.get('/', routes.index);

app.get('/notif', routes.notif);

app.post('/auth', routes.auth);
app.post('/signup', routes.signup);

app.get('/group/:id', routes.getGroup);
app.get('/group/tree/:id', routes.getGroupTree);
app.post('/group/create', routes.createGroup);
app.del('/group/delete/:id', routes.deleteGroup);

/**
 * Initialize Server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
