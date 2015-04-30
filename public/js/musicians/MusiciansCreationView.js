define(function(require) {
	// var Backbone = require('backbone');
	var Marionette = require("marionette");
	var MusicianFacesView = require('./MusicianFacesView')
	var Handlebars = require('handlebars');

	return Marionette.LayoutView.extend({
		template: require('text!../templates/musician-creation-template.html'),
		ui: {
			name: "input[name=name]",
			bio: "textarea[name=bio]",
			picture: "input[name=picture]",
		},
		events: {
			'submit': 'submit'
		},
		regions: {
			pictures:".musician-faces"
		},
		initialize: function() {
			this.listenTo(this.collection, 'add', function() {
				this.ui.name.val('');
				this.ui.bio.val('');
				this.ui.picture.val('');
			}.bind(this));

			this.listenTo(this.collection, 'invalid', function(model, errors) {
				if (_.contains(errors, 'name'))
					this.$('input[name=name]').closest('.row').addClass('invalid');
			});

			this.childView = new MusicianFacesView();
			// this.render();
			// this.onRender();
		},

		onRender: function() {
			this.pictures.show(this.childView);
		},

		// render: function() {
		// this.$el.append(this.template());
		// this.$('.musician-faces').append(this.childView.el);
		// },

		submit: function(e) {
			e.preventDefault();
			this.ui.name.closest('.row').removeClass('invalid');

			var $name = this.$('input[name=name]');
			var $bio = this.$('textarea[name=bio]');
			var $picture = this.$('input[name=picture]');
			this.collection.create({
				name: $name.val(),
				bio: $bio.val(),
				picture: $picture.val()
			}, {
				wait: true,
				success: function() {
					Backbone.trigger('notification:success', 'Everything went fine');
				}
			});
		}
	});
});
