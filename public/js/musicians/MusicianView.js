define(function(require) {
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');

	return Marionette.ItemView.extend({
		template: require('text!../templates/musician-template.html'),
		events: {
			'mouseover .js-face': 'showDelete',
			'mouseleave .js-face': 'hideDelete',
			'click .js-face': 'delete',
			'click .js-edit': 'edit',
			'click .js-update': 'update'
		},
		showDelete: function() {
			this.$('.js-face').addClass('delete');
		},
		hideDelete: function() {
			this.$('.js-face').removeClass('delete');
		},
		delete: function() {
			this.model
				.destroy({wait: true})
				.done(function() {
					Backbone.trigger('notification:success', 'Everything went fine');
				}.bind(this));
		},
		edit: function(e) {
			e.preventDefault();

			this.$('.js-panel').addClass('editing');
		},
		update: function(e) {
			e.preventDefault();

			var name = this.$('input[name=name]').val();
			var bio = this.$('textarea[name=bio]').val();
			this.model.save({name: name, bio: bio});
		}
	});
});
