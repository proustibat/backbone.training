define(function(require) {
	// var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');

	return Marionette.ItemView.extend({
		template: require('text!../templates/musician-faces-template.html'),
		initialize: function() {
			// this.$el.html(this.template(this.model.toJSON()));
		},
		events: {
			'click img': 'pick'
		},
		pick: function() {
			this.trigger('selection', this.model);
			this.$('img').addClass('selected');
		}
	});
});
