(function (window, $, _, Backbone, PUApp) {
	var PromptsView = Backbone.View.extend({
		el: '#prompts-container',
		template: PUApp.templates['prompts-template'],
		initialize: function () {
		},
		events: {
			'click .tag': 'filterByTag',
			'click .priority': 'filterByPriority'
		},
		lastquery: undefined,
		filterByTag: function (e) {
			var tagName = $(e.target).html();
			this.render(this.model.filterByTag(tagName), true);
		},
		filterByPriority: function (e) {
			var priority = $(e.target).attr('priority');
			this.render(this.model.filterByPriority(priority), true);
		},
		search: function (query) {
			if (query !== this.lastquery) {
				this.render(this.model.search(query), true);
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
				}, animate).outerHeight(true);
			});
		},
		render: function (models, animate) {
			var prompts = models || this.model.models,
				templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
			this.$el.html(this.template(templateCtx));
			this.sort(prompts, false, animate ? 'slow' : 0);
			return this;
		}
	});

	PUApp.views.PromptsView = PromptsView;
}(window, $, _, Backbone, PUApp));