(function (window, $, _, Backbone, PUApp) {
	var PromptsView = Backbone.View.extend({
		el: '#prompts-container',
		template: PUApp.templates['prompts-template'],
		initialize: function () {
		},
		events: {
		},
		sort: function (models, delay) {
			var top = 0,
				z = models.length + 1;
			_.each(models, function (m, i) {
				top += $('#prompt-' + m.id).css({
					'z-index': z--
				}).delay(delay ? i * 35 : 0).animate({
						top: top + 'px'
					}, 'slow').outerHeight(true);
			});
		},
		render: function (models) {
			var templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
			this.$el.html(this.template(templateCtx));
			this.sort(this.model.models, false);
			return this;
		}
	});

	PUApp.views.PromptsView = PromptsView;
}(window, $, _, Backbone, PUApp));