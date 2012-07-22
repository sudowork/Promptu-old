(function (window, $, _, Backbone, PUApp) {
  var PromptsView = Backbone.View.extend({
    el: '#prompts-container',
    template: PUApp.templates['prompts-template'],
    initialize: function () {
    },
    events: {
    },
    render: function (models) {
      var templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
      this.$el.html(this.template(templateCtx));
      $('[rel=tooltipLeft]').tooltip({placement: 'left'}).tooltip('hide');
      $('[rel=tooltipTop]').tooltip({placement: 'top'}).tooltip('hide');
      return this;
    }
  });

  PUApp.views.PromptsView = PromptsView;
}(window, $, _, Backbone, PUApp));