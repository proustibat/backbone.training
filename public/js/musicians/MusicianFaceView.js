define(function(require) {
	var Marionette = require('marionette');
	var Handlebars = require('handlebars'); 

	return Marionette.ItemView.extend({
		template: require('text!../templates/musician-faces-template.html'),
		events: {
			'click img': 'pick'
		},
		pick: function() {
			this.trigger('selection', this.model);
			this.$('img').addClass('selected');
		}
	});
});