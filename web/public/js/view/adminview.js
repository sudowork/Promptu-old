(function (window, $, _, Backbone, PUApp) {
	var AdminView = Backbone.View.extend({
		el: '#admin-container',
		template: PUApp.templates['admin-template'],
		initialize: function () {
		},
		createPrompt: function (obj) {
			$.ajax({
				url: 'promptuapp.com:3000/prompt/create',
				type: 'post',
				data: obj,
				success: function () {
					$(PUApp.templates['success-template']({
						header: 'Congrats!',
						message: 'You\'ve successfully created a prompt!'
					})).insertBefore(this.$el.children().first());
				},
				error: function () {
					$(PUApp.templates['error-template']({
						header: 'Error!',
						message: 'Something went wrong! Please try again'
					})).insertBefore(this.$el.children().first());
				}
			});
		},
		render: function (models, animate) {
			var templateCtx = (models && _.invoke(models, 'toJSON')) || this.model.toJSON();
			this.$el.html(this.template(templateCtx));
			return this;
		}
	});

	PUApp.views.AdminView = AdminView;
}(window, $, _, Backbone, PUApp));