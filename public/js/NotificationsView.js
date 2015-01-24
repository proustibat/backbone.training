define(function(require) {
	var Backbone = require('backbone');
	var Handlebars = require('handlebars'); 
	
	return Backbone.View.extend({
		template: Handlebars.compile(require('text!./templates/notification-template.html')),
		initialize: function() {
			this.listenTo(Backbone, 'notification:success', this.renderSuccess);
			this.listenTo(Backbone, 'notification:failure', this.renderError);
		},
		renderSuccess: function(message) {
			this.render(message, 'secondary');
		},
		renderError: function(message) {
			this.render(message, 'alert');
		},
		render: _.throttle(function(message, clazz) {
			if(!message) return;

			var $message = $(this.template(message)).addClass(clazz);
			this.$el.append($message);
			$message.on('click .close', function(e) {
				e.preventDefault();
				$message.remove();
			})

			_.delay(function() {
				$message.fadeOut(300, function() { $message.remove(); });
			}.bind(this), 1700);
		}, 2000)
	});
});