(function (window, $, _, Backbone, PUApp) {
  var Router = Backbone.Router.extend({
    routes: {
      '' : 'init',
      '*other': 'redirect'
    },
    init: function () {

    },
    redirect: function () {

    }
  });

  PUApp.controllers.Router = Router;

  var router = new Router();

  var Doc = Backbone.View.extend({
    el: 'body',
    initialize: function () {
      console.log('init');
    },
    events: {
      'keyup': 'keyUpHandler'
    },
    keyUpHandler: function (e) {
      console.log(e.which);
    }
  });

  new Doc();
}(window, $, _, Backbone, PUApp));