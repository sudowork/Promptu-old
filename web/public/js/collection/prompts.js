(function (window, $, _, Backbone, PUApp) {
	var Prompt = PUApp.models.Prompt;

	var Prompts = Backbone.Collection.extend({
		url: function () {
			return '/prompt/sync?sessionToken=' + PUApp.user.token;
		},
		parse: function (data) {
			return data && data.yolo;
		},
		model: Prompt,
		initialize: function () {
		},
		sort: function (field) {
			return this.sortBy(function (model) {
				return model.get(field);
			});
		},
		filterByTag: function (tag) {
			return this.filter(function (prompt) {
				return _.include(prompt.get('tags'), tag);
			});
		},
		filterByPriority: function (priority) {
			return this.filter(function (prompt) {
				return prompt.get('priority') == priority;
			});
		},
		search: function (query) {
			query = query.toLowerCase();
			return this.filter(function (prompt) {
				return prompt.get('header').toLowerCase().indexOf(query) >= 0 ||
					prompt.get('body').toLowerCase().indexOf(query) >= 0 ||
					_.any(prompt.get('tags'), function (tag) {
						return tag.toLowerCase().indexOf(query) >= 0;
					});
			});
		}
	});

	PUApp.collections.Prompts = Prompts;
}(window, $, _, Backbone, PUApp));