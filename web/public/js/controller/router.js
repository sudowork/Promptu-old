(function (window, $, _, Backbone, PUApp) {
	var Admin = PUApp.models.Admin,
		AdminView = PUApp.views.AdminView,
		Prompt = PUApp.models.Prompt,
		Prompts = PUApp.collections.Prompts,
		PromptsView = PUApp.views.PromptsView,
		Group = PUApp.models.Group,
		Groups = PUApp.collections.Groups,
		GroupsView = PUApp.views.GroupsView;

	var $prompts = $('#prompts-container'),
		$groups = $('#groups-container'),
		$prefs = $('#prefs-container'),
		$admin = $('#admin-container'),
		$current, $next;

	var transition = {
		$current: undefined,
		$next: undefined,
		param: 'fast',
		push: function (next) {
			if (this.$current !== next) {
				this.$next = next;
				if (this.$current) this.$current.slideUp(this.param);
				if (this.$next) this.$next.slideDown(this.param);
				this.$current = this.$next;
			}
		}
	};

	var Router = Backbone.Router.extend({
		initialize: function () {
			this.checkConnection();

			this.promptsModel = new Prompts();
			this.promptsView = new PromptsView({
				model: this.promptsModel
			});
			this.promptsModel.fetch({
				success: _.bind(function (data) {
					this.promptsView.render();
					transition.push($prompts);
				}, this)
			});


			this.groupsModel = new Groups();
			this.groupsView = new GroupsView({
				model: this.groupsModel
			});

			this.groupsModel.fetch({
				success: _.bind(function (data) {
					this.groupsView.render();
					transition.push($groups);
				}, this)
			});

			this.admin = new Admin();
			this.adminView = new AdminView({
				model: this.admin
			});
		},
		routes: {
			'' : 'init',
			'login/:hash': 'login',
			'prompts': 'prompts',
			'groups': 'showGroup',
			'admin': 'showAdmin',
			'prefs': 'showPrefs',
			'sortby/:field': 'sortPrompts',
			'search/:query': 'searchPrompts',
			'tag/:tag': 'filterByTag',
			'priority/:priority': 'filterByPriority',
			'*other': 'redirect'
		},
		login: function (hash) {
			PUApp.user.token = hash;
			sessionStorage['promptutoken'] = hash;
			this.navigate('', { trigger: true });
		},
		checkConnection: function () {
			PUApp.user.token = PUApp.user.token || sessionStorage['promptutoken'];
			if (!PUApp.user.token) {
				window.location = '/login';
				return false;
			}
			return true;
		},
		init: function () {
			this.navigate('prompts', { trigger: true });
		},
		prompts: function () {
			this.promptsView.render();
			$('.main .search-query').attr('value', '').blur();
		},
		showAdmin: function () {
			this.checkConnection();
			transition.push($admin);
			this.adminView.render();
		},
		showGroup: function () {
			this.checkConnection();
			transition.push($groups);
			this.groupsView.render();
		},
		showPrefs: function () {
			this.checkConnection();
			transition.push($prefs);
		},
		sortPrompts: function (field) {
			this.checkConnection();
			this.promptsView.sort(field);
		},
		filterByTag: function (tag) {
			this.checkConnection();
			this.promptsView.filterByTag(tag);
		},
		filterByPriority: function (priority) {
			this.checkConnection();
			this.promptsView.filterByPriority(priority);
		},
		searchPrompts: function (query) {
			this.checkConnection();
			this.promptsView.search(query);
		},
		redirect: function () {
			// window.location = '/login';
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
			'keyup .main .search-query': 'searchPrompts',
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
			if (tagName) {
				router.navigate('tag/' + tagName, { trigger: true });
			} else {
				router.navigate('', { trigger: true });
			}
		},
		filterByPriority: function (e) {
			var priority = $(e.target).attr('priority');
			if (priority) {
				router.navigate('priority/' + priority, { trigger: true });
			} else {
				router.navigate('', { trigger: true });
			}
		},
		searchPrompts: function (e) {
			var query = $(e.currentTarget).attr('value');
			if (query) {
				router.navigate('search/' + query, { trigger: true });
			} else {
				router.navigate('', { trigger: true });
			}
		},
		keyUpHandler: function (e) {
			if (e.which === 27) {
				router.navigate('', { trigger: true });
			}
		}
	});

	new Doc();
}(window, $, _, Backbone, PUApp));
