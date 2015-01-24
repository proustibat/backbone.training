define(function(require) {
	var Marionette = require('marionette');
	var MusicianFacesView = require('./MusicianFacesView')
	var Handlebars = require('handlebars'); 

	return Marionette.LayoutView.extend({
		template: require('text!../templates/musician-creation-template.html'),
		ui: {
			name: 'input[name=name]',
			bio: 'textarea[name=bio]',
			picture: 'input[name=picture]'
		},
		initialize: function() {
			this.listenTo(this.collection, 'add', function() {
				this.ui.name.val('');
				this.ui.bio.val('');
				this.ui.picture.val('');
			}.bind(this));

			this.listenTo(this.collection, 'invalid', function(model, errors) {
				if (_.contains(errors, 'name')) 
					this.ui.name.closest('.row').addClass('invalid');
			});
		},
		events: {
			'submit': 'submit'
		},
		regions: {
			faces: '.musician-faces'
		},
		onRender: function() {
			this.faces.show(new MusicianFacesView());
		},
		submit: function(e) {
			e.preventDefault();
			this.ui.name.closest('.row').removeClass('invalid');

			this.collection.create({name: this.ui.name.val(), bio: this.ui.bio.val(), picture: this.ui.picture.val()}, {wait: true, 
				success: function() { Backbone.trigger('notification:success', 'Everything went fine'); }
			});
		}
	});
});