define(function(require) {
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var Radio = require('radio');

	return Marionette.ItemView.extend({
		template: require('text!../templates/musician-template.html'),
		events: {
			'mouseover .js-face': 'showDelete',
			'mouseleave .js-face': 'hideDelete',
			'click .js-face': 'delete',
			'click .js-edit': 'edit',
			'click .js-update': 'update'
		},
		initialize: function() {
			// this.$el.html(this.template(this.model.toJSON()));
		},
		showDelete: function() {
			this.$('.js-face').addClass('delete');
		},
		hideDelete: function() {
			this.$('.js-face').removeClass('delete');
		},
		edit: function(e) {
			console.log('edit');
			e.preventDefault();
			this.$('.js-panel').addClass('editing');
		},
		update: function(e) {
			e.preventDefault();

			var name = this.$('input[name=name]').val();
			var bio = this.$('textarea[name=bio]').val();
			this.model.save({
				name: name,
				bio: bio
			});
		},
		delete: function() {
			var isGranted = Radio.channel('musician').request('delete', this.model);
			if (isGranted) {
				this.model
					.destroy({
						wait: true
					})
					.done(function() {
						Backbone.trigger('notification:success', 'Everything went fine');
						console.log('DELETED');
						this.remove();
					}.bind(this));
			}
		}
	});
});
