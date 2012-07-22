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
    }
  });

  PUApp.collections.Prompts = Prompts;
}(window, $, _, Backbone, PUApp));