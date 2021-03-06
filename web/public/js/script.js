var PUApp = {
  models: {},
  views: {},
  collections: {},
  controllers: {},
  config: {},
  templates: {},
  user: {}
};

$(document).ready(function () {
  Backbone.history.start();
  $('.dropdown-toggle').dropdown();
  $('[rel=tooltipLeft]').tooltip({placement: 'left'});
  $('[rel=tooltipTop]').tooltip({placement: 'top'});
});

$('script[type="text/template"]').each(function (i, e) {
    var $e = $(e);
    PUApp.templates[$e.attr('id')] = _.template($e.html());
}).remove();


