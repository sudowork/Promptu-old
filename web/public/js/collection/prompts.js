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
    filterByTag: function (tag) {
      return this.filter(function (prompt) {
        return _.include(prompt.get('tags'), tag);
      });
    },
		search: function (query) {
			return this.filter(function (prompt) {
				return prompt.get('header').indexOf(query) >= 0 ||
					prompt.get('body').indexOf(query) >= 0 ||
					_.any(prompt.get('tags'), function (tag) {
						return tag.indexOf(query) >= 0;
					});
			});
		}
	});

	PUApp.collections.Prompts = Prompts;
}(window, $, _, Backbone, PUApp));