(function (window, $, _, Backbone, PUApp) {
	var Prompt = PUApp.models.Prompt,
		Prompts = PUApp.collections.Prompts,
		PromptsView = PUApp.views.PromptsView,
		Group = PUApp.models.Group,
		Groups = PUApp.collections.Groups,
		GroupsView = PUApp.views.GroupsView;

	var $prompts = $('#prompts-container'),
		$groups = $('#groups-container'),
		$detail = $('#detail-container'),
		$prefs = $('#prefs-container'),
		$current, $next;

	var transition = {
		$current: undefined,
		$next: undefined,
		param: 'fast',
		push: function (next) {
			if (this.$current != next) {
				this.$next = next;
				if (this.$current) this.$current.slideUp(this.param);
				if (this.$next) this.$next.slideDown(this.param);
				this.$current = this.$next;
			}
		}
	};

	var Router = Backbone.Router.extend({
		routes: {
			'' : 'prompts',
			'login/:hash': 'login',
			'prompts': 'prompts',
			'detail/:id': 'showDetail',
			'groups': 'showGroup',
			'prefs': 'showPrefs',
			'sortby/:field': 'sortPrompts',
			'search/:query': 'searchPrompts',
			'tag/:tag': 'filterByTag',
			'priority/:priority': 'filterByPriority',
			'*other': 'redirect'
		},
		login: function (hash) {
			console.log(hash);
		},
		prompts: function () {
			transition.push($prompts);

			this.promptsModel = this.promptsModel || new Prompts();
			this.promptsView = this.promptsView || new PromptsView({
				model: this.promptsModel
			});

			this.promptsModel.reset([
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

			this.promptsView.render();
			$('#main .search-query').attr('value', '').blur();
		},
		showGroup: function () {
			transition.push($groups);

			this.groupsModel = this.groupsModel || new Groups();
			this.groupsView = this.groupsView || new GroupsView({
				model: this.groupsModel
			});

			this.groupsModel.reset([
				{ id: 0, priority: 0, header: 'test', body: 'yolo' },
				{ id: 1, priority: 1, header: 'test2', body: 'yolo' },
				{ id: 2, priority: 2, header: 'test3', body: 'yolo' },
				{ id: 3, priority: 3, header: 'test', body: 'yolo' },
				{ id: 4, priority: 1, header: 'test2', body: 'yolo' },
				{ id: 5, priority: 2, header: 'test3', body: 'yolo' },
				{ id: 6, priority: 1, header: 'test', body: 'yolo' },
				{ id: 7, priority: 1, header: 'test2', body: 'yolo' },
				{ id: 17, priority: 3, header: 'test3', body: 'yolo' },
				{ id: 18, priority: 0, header: 'test', body: 'yolo' },
				{ id: 19, priority: 1, header: 'test2', body: 'yolo' },
				{ id: 20, priority: 1, header: 'test3', body: 'yolo' },
				{ id: 21, priority: 1, header: 'test4', body: 'yolo'  }
			]);

			this.groupsView.render();
		},
		showDetail: function (id) {
			transition.push($detail);
		},
		showPrefs: function () {
			transition.push($prefs);
		},
		sortPrompts: function (field) {
			this.promptsView.sort(field);
		},
		filterByTag: function (tag) {
			this.promptsView.filterByTag(tag);
		},
		filterByPriority: function (priority) {
			this.promptsView.filterByPriority(priority);
		},
		searchPrompts: function (query) {
			this.promptsView.search(query);
		},
		redirect: function () {

		}
	});

	PUApp.controllers.Router = Router;

	var router = new Router();

	var Doc = Backbone.View.extend({
		el: 'body',
		initialize: function () {
		},
		events: {
			'click .byheader': 'sortByHeader',
			'click .bypriority': 'sortByPriority',
			'click #prompts-container .tag': 'filterByTag',
			'click #prompts-container .priority': 'filterByPriority',
			'keyup #main .search-query': 'searchPrompts',
			'keyup': 'keyUpHandler'
		},
		sortByHeader: function (e) {
			router.navigate('sortby/header', { trigger: true });
		},
		sortByPriority: function (e) {
			router.navigate('sortby/priority', { trigger: true });
		},
		filterByTag: function (e) {
			var tagName = $(e.target).html();
			router.navigate('tag/' + tagName, { trigger: true });
		},
		filterByPriority: function (e) {
			var priority = $(e.target).attr('priority');
			router.navigate('priority/' + priority, { trigger: true });
		},
		searchPrompts: function (e) {
			var query = $(e.currentTarget).attr('value');
			router.navigate('search/' + query, { trigger: true });
		},
		keyUpHandler: function (e) {
			if (e.which === 27) {
				router.navigate('', { trigger: true });
			}
		}
	});

	new Doc();
}(window, $, _, Backbone, PUApp));