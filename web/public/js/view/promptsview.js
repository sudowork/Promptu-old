(function (window, $, _, Backbone, PUApp) {
	var PromptsView = Backbone.View.extend({
		el: '#prompts-container',
		template: PUApp.templates['prompts-template'],
		initialize: function () {
		},
		events: {
		},
		lastquery: '',
		search: function (query) {
			if (query !== this.lastquery) {
				this.render(this.model.search(query));
			this.lastquery = query;
			return true;
			}
			return false;
		},
		sort: function (models, delay, animate) {
			var top = 0,
				z = models.length + 1;
			_.each(models, function (m, i) {
				top += $('#prompt-' + m.id).css({
					'z-index': z--
				}).delay(delay ? i * 35 : 0).animate({
					top: top + 'px'
				}, animate || 'slow').outerHeight(true);
			});
		},
		render: function (models) {
			var prompts = models || this.model.models,
				templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
			this.$el.html(this.template(templateCtx));
			this.sort(prompts, false, 500);
			return this;
		}
	});

	PUApp.views.PromptsView = PromptsView;
}(window, $, _, Backbone, PUApp));