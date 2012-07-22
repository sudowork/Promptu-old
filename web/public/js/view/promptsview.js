(function (window, $, _, Backbone, PUApp) {
  var PromptsView = Backbone.View.extend({
    el: '#prompts',
    template: PUApp.templates['prompts-template'],
    initialize: function () {
    },
    events: {
    },
    render: function (models) {
      var templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
      this.$el.html(this.template(templateCtx));
      return this;
    }
  });

  PUApp.views.PromptsView = PromptsView;
}(window, $, _, Backbone, PUApp));