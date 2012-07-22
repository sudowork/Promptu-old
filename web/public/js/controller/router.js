(function (window, $, _, Backbone, PUApp) {
  var Prompt = PUApp.models.Prompt,
    Prompts = PUApp.collections.Prompts,
    PromptsView = PUApp.views.PromptsView;

  var Router = Backbone.Router.extend({
    routes: {
      '' : 'init',
      '*other': 'redirect'
    },
    init: function () {
      this.prompts = new Prompts();
      this.promptsview = new PromptsView({
	model: this.prompts
      });

      this.prompts.add([
	{ priority: 0, header: 'test', body: 'yolo', tags: ['aaa'] },
	{ priority: 1, header: 'test2', body: 'yolo', tags: ['bbb'] },
	{ priority: 2, header: 'test3', body: 'yolo', tags: ['aaa'] },
	{ priority: 3, header: 'test', body: 'yolo', tags: [] },
	{ priority: 1, header: 'test2', body: 'yolo', tags: ['aaa'] },
	{ priority: 2, header: 'test3', body: 'yolo', tags: [] },
	{ priority: 1, header: 'test', body: 'yolo', tags: [] },
	{ priority: 1, header: 'test2', body: 'yolo', tags: ['aaa'] },
	{ priority: 2, header: 'test3', body: 'yolo', tags: [] },
	{ priority: 3, header: 'test', body: 'yolo', tags: ['bbb'] },
	{ priority: 0, header: 'test2', body: 'yolo', tags: [] },
	{ priority: 1, header: 'test3', body: 'yolo', tags: [] },
	{ priority: 2, header: 'test', body: 'yolo', tags: ['bbb'] },
	{ priority: 3, header: 'test2', body: 'yolo', tags: [] },
	{ priority: 0, header: 'test3', body: 'yolo', tags: ['bbb'] },
	{ priority: 1, header: 'test', body: 'yolo', tags: [] },
	{ priority: 2, header: 'test2', body: 'yolo', tags: [] },
	{ priority: 3, header: 'test3', body: 'yolo', tags: [] },
	{ priority: 0, header: 'test', body: 'yolo', tags: [] },
	{ priority: 1, header: 'test2', body: 'yolo', tags: [] },
	{ priority: 1, header: 'test3', body: 'yolo', tags: [] },
	{ priority: 1, header: 'test4', body: 'yolo', tags: [] }
      ]);

      this.promptsview.render();

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