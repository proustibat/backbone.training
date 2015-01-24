define(function(require) {
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars'); 
	
	return Marionette.ItemView.extend({
		template: require('text!../templates/musician-template.html'),
		events: {
			'mouseover': 'showDelete',
			'mouseleave': 'hideDelete',
			'click': 'delete'
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
				}.bind(this));
		}
	});
});