(function (window, $, _, Backbone, PUApp) {
	var Prompt = PUApp.models.Prompt,
		Prompts = PUApp.collections.Prompts,
		PromptsView = PUApp.views.PromptsView;

	var $prompts = $('#prompts-container'),
		$detail = $('#detail-container'),
		$prefs = $('#prefs-container'),
		$current, $next;

	var transition = {
		$current: undefined,
		$next: undefined,
		param: 'fast',
		push: function (next) {
			this.$next = next;
			if (this.$current) this.$current.slideUp(this.param);
			if (this.$next) this.$next.slideDown(this.param);
			this.$current = this.$next;
		}
	};

	var Router = Backbone.Router.extend({
		routes: {
			'' : 'prompts',
			'prompts' : 'prompts',
			'detail/:id': 'showDetail',
			'prefs': 'showPrefs',
			'*other': 'redirect'
		},
		prompts: function () {
			transition.push($prompts);

			this.prompts = new Prompts();
			this.promptsview = new PromptsView({
	model: this.prompts
			});

			this.prompts.add([
				{ id: 0, priority: 0, header: 'test', body: 'yolo', tags: ['aaa'] },
				{ id: 1, priority: 1, header: 'test2', body: 'yolo', tags: ['bbb'] },
				{ id: 2, priority: 2, header: 'test3', body: 'yolo', tags: ['aaa'] },
				{ id: 3, priority: 3, header: 'test', body: 'yolo', tags: [] },
				{ id: 4, priority: 1, header: 'test2', body: 'yolo', tags: ['aaa'] },
				{ id: 5, priority: 2, header: 'test3', body: 'yolo', tags: [] },
				{ id: 6, priority: 1, header: 'test', body: 'yolo', tags: [] },
				{ id: 7, priority: 1, header: 'test2', body: 'yolo', tags: ['aaa'] },
				{ id: 8, priority: 2, header: 'test3', body: 'yolo', tags: [] },
				{ id: 9, priority: 3, header: 'test', body: 'yolo', tags: ['bbb'] },
				{ id: 10, priority: 0, header: 'test2', body: 'yolo', tags: [] },
				{ id: 11, priority: 1, header: 'test3', body: 'yolo', tags: [] },
				{ id: 12, priority: 2, header: 'test', body: 'yolo', tags: ['bbb'] },
				{ id: 13, priority: 3, header: 'test2', body: 'yolo', tags: [] },
				{ id: 14, priority: 0, header: 'test3', body: 'yolo', tags: ['bbb'] },
				{ id: 15, priority: 1, header: 'test', body: 'yolo', tags: [] },
				{ id: 16, priority: 2, header: 'test2', body: 'yolo', tags: [] },
				{ id: 17, priority: 3, header: 'test3', body: 'yolo', tags: [] },
				{ id: 18, priority: 0, header: 'test', body: 'yolo', tags: [] },
				{ id: 19, priority: 1, header: 'test2', body: 'yolo', tags: [] },
				{ id: 20, priority: 1, header: 'test3', body: 'yolo', tags: [] },
				{ id: 21, priority: 1, header: 'test4', body: 'yolo', tags: [] }
			]);

			this.promptsview.render();
		},
		showDetail: function (id) {
			transition.push($detail);
		},
		showPrefs: function () {
			transition.push($prefs);
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
			'click .byheader': 'sortByHeader',
			'click .bypriority': 'sortByPriority',
			'keyup #main .search-query': 'searchPrompts',
			'keyup': 'keyUpHandler'
		},
		sortByHeader: function (e) {
			router.promptsview.sort(router.prompts.sort('header'), true);
		},
		sortByPriority: function (e) {
			router.promptsview.sort(router.prompts.sort('priority'), true);
		},
		searchPrompts: function (e) {
			var query = $(e.currentTarget).attr('value');
			if (router.promptsview.search(query)) {
				e.stopPropagation();
			}
		},
		keyUpHandler: function (e) {
			if (e.which === 27) {
				router.promptsview.search('');
				$('#main .search-query').attr('value', '').blur();
			}
		}
	});

	new Doc();
}(window, $, _, Backbone, PUApp));