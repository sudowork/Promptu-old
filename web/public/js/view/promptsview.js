(function (window, $, _, Backbone, PUApp) {
	var PromptsView = Backbone.View.extend({
		el: '#prompts-container',
		template: PUApp.templates['prompts-template'],
		initialize: function () {
		},
		events: {
		},
		sort: function (models) {
			var top = 0,
				z = models.length + 1;
			_.each(models, function (m, i) {
				top += $('#prompt-' + m.id).delay(i * 25).animate({
						'z-index': z--,
						top: top + 'px'
					}, 'slow').outerHeight(true);
			});
		},
		render: function (models) {
			var templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
			this.$el.html(this.template(templateCtx));
			$('[rel=tooltipLeft]').tooltip({placement: 'left'}).tooltip('hide');
			$('[rel=tooltipTop]').tooltip({placement: 'top'}).tooltip('hide');
			this.sort(this.model.models);
			return this;
		}
	});

	PUApp.views.PromptsView = PromptsView;
}(window, $, _, Backbone, PUApp));