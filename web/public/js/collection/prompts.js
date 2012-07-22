(function (window, $, _, Backbone, PUApp) {
	var Prompt = PUApp.models.Prompt;

	var Prompts = Backbone.Collection.extend({
		model: Prompt,
		initialize: function () {
		},
		sort: function (field) {
			return this.sortBy(function (model) {
				return model.get(field);
			});
		},
		search: function (query) {
			return this.filter(function (notif) {
				return notif.get('header').indexOf(query) >= 0 ||
					notif.get('body').indexOf(query) >= 0 ||
					_.any(notif.get('tags'), function (tag) {
						return tag.indexOf(query) >= 0;
					});
			});
		}
	});

	PUApp.collections.Prompts = Prompts;
}(window, $, _, Backbone, PUApp));