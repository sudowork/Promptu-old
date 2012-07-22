(function (window, $, _, Backbone, PUApp) {
  var Group = PUApp.models.Group;

  var Groups = Backbone.Collection.extend({
		url: function () {
			return '/prompt/sync?sessionToken=' + PUApp.user.token;
		},
    model: Group,

    initialize: function () {
    }
  });

  PUApp.collections.Groups = Groups;
}(window, $, _, Backbone, PUApp));
