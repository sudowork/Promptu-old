(function (window, $, _, Backbone, PUApp) {
	var Prompt = Backbone.Model.extend({
		idAttribute: "_id",
		initialize: function () {
		}
	});

	PUApp.models.Prompt = Prompt;
}(window, $, _, Backbone, PUApp));