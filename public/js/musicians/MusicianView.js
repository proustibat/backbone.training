define(function(require) {
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var tipper = require('tipper');
	var Radio = require('radio');
	var socket = require('../Socket');

	return Marionette.ItemView.extend({
		template: require('text!../templates/musician-template.html'),
		events: {
			'mouseover .js-face': 'showDelete',
			'mouseleave .js-face': 'hideDelete',
			'click .js-face': 'delete',
			'click .js-edit': 'edit',
			'click .js-update': 'update',
			'click .js-fame': 'increaseFame'
		},
		modelEvents: {
			'change:fame': function() {
				if(!this.isEditing)
					this.render();
			}
		},
		showDelete: function() {
			this.$('.js-face').addClass('delete');
		},
		hideDelete: function() {
			this.$('.js-face').removeClass('delete');
		},
		delete: function() {
			var isGranted = Radio.channel('musician').request('delete', this.model);
			if(isGranted)
				this.model
					.destroy({wait: true})
					.done(function() {
						Backbone.trigger('notification:success', 'Everything went fine');
					}.bind(this));
		},
		edit: function(e) {
			e.preventDefault();

			this.$('.js-panel').addClass('editing');
			this.isEditing = true;
		},
		update: function(e) {
			e.preventDefault();

			var name = this.$('input[name=name]').val();
			var bio = this.$('textarea[name=bio]').val();
			this.model.save({name: name, bio: bio});
		},
		onBeforeRender: function() {
			this.$('.js-fame').tipper('destroy');
		},
		onRender: function() {
			this.$('.js-fame').tipper({direction: 'top'});
			this.isEditing = false;
		},
		increaseFame: function() {
			socket.emit('fame', this.model.id);
		}
	});
});
