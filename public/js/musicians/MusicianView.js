define(function(require) {
	var Backbone = require('backbone');
	var Handlebars = require('handlebars'); 
	
	return Backbone.View.extend({
		template: Handlebars.compile(require('text!../templates/musician-template.html')),
		events: {
			'mouseover': 'showDelete',
			'mouseleave': 'hideDelete',
			'click': 'delete'
		},
		initialize: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		showDelete: function() {
			this.$('.columns').addClass('delete');
		},
		hideDelete: function() {
			this.$('.columns').removeClass('delete');
		},
		delete: function() {
			this.model
				.destroy({wait: true})
				.done(function() {
					Backbone.trigger('notification:success', 'Everything went fine');
					this.remove();
				}.bind(this));
		}
	});
});