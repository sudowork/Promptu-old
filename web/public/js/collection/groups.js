(function (window, $, _, Backbone, PUApp) {
  var Group = PUApp.models.Group;

  var Groups = Backbone.Collection.extend({
    model: Group,

    initialize: function () {
    }
  });

  PUApp.collections.Groups = Groups;
}(window, $, _, Backbone, PUApp));