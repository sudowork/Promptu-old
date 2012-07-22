(function (window, $, _, Backbone, PUApp) {
	var Group = Backbone.Model.extend({
		idAttribute: "_id",
		initialize: function () {
		}
	});

	PUApp.models.Group = Group;
}(window, $, _, Backbone, PUApp));