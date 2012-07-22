(function (window, $, _, Backbone, PUApp) {
  var Prompt = PUApp.models.Prompt;

  var Prompts = Backbone.Collection.extend({
    model: Prompt,
    initialize: function () {
    }
  });

  PUApp.collections.Prompts = Prompts;
}(window, $, _, Backbone, PUApp));