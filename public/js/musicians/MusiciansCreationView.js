define(function(require) {
	var Backbone = require('backbone');
	var MusicianFacesView = require('./MusicianFacesView')
	var Handlebars = require('handlebars'); 

	return Backbone.View.extend({
		template: Handlebars.compile(require('text!../templates/musician-creation-template.html')),
		initialize: function() {
			this.listenTo(this.collection, 'add', function() {
				var $name = this.$('input[name=name]');
				var $bio = this.$('textarea[name=bio]');
				var $picture = this.$('input[name=picture]');
				$name.val('');
				$bio.val('');
				$picture.val('');
			}.bind(this));

			this.listenTo(this.collection, 'invalid', function(model, errors) {
				if (_.contains(errors, 'name')) 
					this.$('input[name=name]').closest('.row').addClass('invalid');
			});

			this.childView = new MusicianFacesView();
			this.render();
		},
		events: {
			'submit': 'submit'
		},
		render: function() {
			this.$el.append(this.template());
			this.$('.musician-faces').append(this.childView.el);
		},
		submit: function(e) {
			e.preventDefault();
			this.$('input[name=name]').closest('.row').removeClass('invalid');

			var $name = this.$('input[name=name]');
			var $bio = this.$('textarea[name=bio]');
			var $picture = this.$('input[name=picture]');
			this.collection.create({name: $name.val(), bio: $bio.val(), picture: $picture.val()}, {wait: true, 
				success: function() { Backbone.trigger('notification:success', 'Everything went fine'); }
			});
		}
	});
});