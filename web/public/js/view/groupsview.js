(function (window, $, _, Backbone, PUApp) {
  var GroupsView = Backbone.View.extend({
    el: '#groups',
    template: PUApp.templates['groups-template'],
    initialize: function () {
    },
    render: function (models, animate) {
      var templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
      this.$el.html(this.template(templateCtx));
      $('.dropdown-toggle').dropdown();
      $('[rel=tooltipLeft]').tooltip({placement: 'left'});
      $('[rel=tooltipTop]').tooltip({placement: 'top'});
      return this;
    }
  });

  PUApp.views.GroupsView = GroupsView;
}(window, $, _, Backbone, PUApp));