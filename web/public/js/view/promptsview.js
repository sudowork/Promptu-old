(function (window, $, _, Backbone, PUApp) {
	var PromptsView = Backbone.View.extend({
		el: '#prompt-list',
		template: PUApp.templates['prompts-template'],
		initialize: function () {
		},
		events: {
		},
		lastop: undefined,
		filterByTag: function (tag) {
			if (tag !== this.lastop) {
				this.render(this.model.filterByTag(tag), true);
			}
		},
		filterByPriority: function (priority) {
			if (priority !== this.lastop) {
				this.render(this.model.filterByPriority(priority), true);
			}
		},
		search: function (query) {
			if (query !== this.lastop) {
				this.render(this.model.search(query), true);
				this.lastop = query;
			}
		},
		sort: function (field) {
			if (field !== this.lastop) {
				this.render(this.model.sort(field), true);
				this.lastop = field;
			}
		},
		computePosition: function (models, delay, animate) {
			var top = 0,
				z = models.length + 1,
				$e;
			_.each(models, function (m, i) {
				$e = $('#prompt-' + m.id);
				if (animate) {
					top += $e.css({
						'z-index': z--
					}).delay(delay ? i * 35 : 0).animate({
						top: top + 'px'
					}, 'slow').outerHeight(true);
				} else {
					top += $e.css({
						top: top + 'px',
						'z-index': z--
					}).delay(delay ? i * 35 : 0).outerHeight(true);
				}
			});
		},
		render: function (models, animate) {
			var prompts = models || this.model.models,
				templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
			this.$el.html(this.template(templateCtx));
			this.computePosition(prompts, false, animate);
			$('.dropdown-toggle').dropdown();
			$('[rel=tooltipLeft]').tooltip({placement: 'left'});
			$('[rel=tooltipTop]').tooltip({placement: 'top'});
			return this;
		}
	});

	PUApp.views.PromptsView = PromptsView;
}(window, $, _, Backbone, PUApp));