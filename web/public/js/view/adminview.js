(function (window, $, _, Backbone, PUApp) {
	var AdminView = Backbone.View.extend({
		el: '#admin-container',
		template: PUApp.templates['admin-template'],
		initialize: function () {
		},
		events: {
			'click button[type="submit"]': 'submitPrompt'
		},
		submitPrompt: function (e) {
			var head = $('#header').val(),
				body = $('#body').val(),
				channels = [],
				date = new Date()/1000 + 10;
				author = '500c21f5a8762bad30000001',
				groups = [];
			if ($('input[value="apn"]').attr('checked')) {
				channels.push('apn');
			}
			if ($('input[value="email"]').attr('checked')) {
				channels.push('email');
			}
			if ($('input[value="sms"]').attr('checked')) {
				channels.push('checked');
			}
			var self = this;
			$('.targets input[type="checkbox"]').each(function (i, e) {
					if ($(e).attr('checked')) {
						groups.push($(e).attr('value'));
					}
			});

			_.each(groups, function (group) {
				self.createPrompt({
					sessionToken: PUApp.user.token,
					group: group,
					channels: channels,
					header: head,
					body: body,
					author: author,
					duedate: date
				});
			});

			e.preventDefault();
		},
		createPrompt: function (obj) {
			var self = this;
			$.ajax({
				url: '/prompt/create',
				type: 'post',
				data: obj,
				success: function () {
					$('.alert').hide('fast');
					$(PUApp.templates['success-template']({
						header: 'Congrats!',
						message: 'You\'ve successfully created a prompt!'
					})).insertBefore(self.$el.children().first());
				},
				error: function () {
					$('.alert').hide('fast');
					$(PUApp.templates['error-template']({
						header: 'Error!',
						message: 'Something went wrong! Please try again'
					})).insertBefore(self.$el.children().first());
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