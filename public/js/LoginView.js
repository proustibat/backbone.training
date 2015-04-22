define(function(require) {
	var Backbone = require('backbone');
	var Handlebars = require('handlebars'); 
	
	return Backbone.View.extend({
		templateLogin: Handlebars.compile(require('text!./templates/login-template.html')),
		templateLogged: Handlebars.compile(require('text!./templates/logged-template.html')),
		events: {
			'submit': 'submit',
			'click .js-logout': 'logout'
		},
		initialize: function() {
			this.model
				.fetch()
				.done(this.renderLogged.bind(this))
				.fail(this.renderLogin.bind(this));

			this.listenTo(this.model, 'logged', this.renderLogged);
		},
		renderLogged: function() {
			this.$el.html(this.templateLogged(this.model.toJSON()));

			require(['./static/proverbs'], function(proverbs) {
				this.$('p').append($('<p/>', {text: proverbs.music}));
			}.bind(this));
		},
		renderLogin: function() {
			this.$el.html(this.templateLogin());
		},
		submit: function(e) {
			e.preventDefault();
			this.$('input[type=submit]').removeClass('animated shake');

			var name = this.$('input[name=name]').val();
			var password = this.$('input[name=password]').val();
			this.model
				.save({name: name, password: password, sign: true})
				.done(this.renderLogged.bind(this))
				.fail(function() {
					this.$('input[type=submit]').addClass('animated shake');
				}.bind(this));
		},
		logout: function(e) {
			e.preventDefault();
			this.model
				.set({sign: true})
				.destroy()
				.done(this.renderLogin.bind(this));
		}
	});;
});