(function (window, $, _, Backbone, PUApp) {
	var Admin = Backbone.Model.extend({
		idAttribute: "_id",
		initialize: function () {
		}
	});

	PUApp.models.Admin = Admin;
}(window, $, _, Backbone, PUApp));