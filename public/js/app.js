"use strict";

$(function() {
	var Pictures = Backbone.Collection.extend({url: '/picture'});

	var Musicians = Backbone.Collection.extend({
		url: '/musician',
		model: Backbone.Model.extend({
			urlRoot: '/musician'
		})
	});

	var User = Backbone.Model.extend({
		initialize: function() {
			this.on('sync', this.notNewAnymore);
		},
		notNewAnymore: function() {
			this.set('id', 0);
		},
		url: function() {
			var url = '/user';
			if(this.has('sign')) {
				this.unset('sign');
				url += '/signin';
			}
			return url;
		}
	});
	var user = new User();

	var MusicianView = Backbone.View.extend({
		template: Handlebars.compile($("#musician-template").html()),
		events: {
			'mouseover': 'showDelete',
			'mouseleave': 'hideDelete',
			'click': 'delete'
		},
		initialize: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		showDelete: function() {
			this.$('.columns').addClass('delete');
		},
		hideDelete: function() {
			this.$('.columns').removeClass('delete');
		},
		delete: function() {
			this.model.destroy({wait: true}).done(_.bind(this.remove, this));
		}
	});

	var MusiciansView = Backbone.View.extend({
		initialize: function() {
			this.collection.fetch();
			this.listenTo(this.collection, 'sync remove', this.render);
		},
		render: function() {
			this.$el.html('');
			
			var $row;
			this.collection.each(function(model, index) {
				if(index % 3 === 0) {
					$row = $('<div class="row">');
					this.$el.append($row);
				}

				$row.append(new MusicianView({model: model}).el);
			}, this);
		}
	});

	var MusicianFaceView = Backbone.View.extend({
		template: Handlebars.compile($("#musician-faces-template").html()),
		initialize: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		events: {
			'click img': 'pick'
		},
		pick: function() {
			this.trigger('selection', this.model);
			this.$('img').addClass('selected');
		}
	});

	var MusiciansFacesView = Backbone.View.extend({
		initialize: function() {
			this.collection = new Pictures();
			this.collection.fetch().done(this.render.bind(this));
		},
		render: function() {
			var $row = $('<div class="row">');
			this.$el.html($row);
			this.collection.each(function(model) {
				var child = new MusicianFaceView({model: model});
				this.listenTo(child, 'selection', this.selection);
				$row.append(child.el);
			}.bind(this));
		},
		selection: function(model) {
			this.$('img').removeClass('selected');
			var $input = this.$el.closest('form').find('input[name=picture]');
			$input.val(model.get('picture'));
		}
	});

	var MusiciansCreationView = Backbone.View.extend({
		template: Handlebars.compile($("#musician-creation-template").html()),
		initialize: function() {
			this.childView = new MusiciansFacesView();
			this.render();
		},
		events: {
			'submit': 'submit'
		},
		render: function() {
			this.$el.append(this.template());
			this.$('.musician-faces').append(this.childView.el);

			this.listenTo(this.collection, 'add', function() {
				var $name = this.$('input[name=name]');
				var $bio = this.$('textarea[name=bio]');
				var $picture = this.$('input[name=picture]');
				$name.val('');
				$bio.val('');
				$picture.val('');
			}.bind(this));
		},
		submit: function(e) {
			e.preventDefault();
			var $name = this.$('input[name=name]');
			var $bio = this.$('textarea[name=bio]');
			var $picture = this.$('input[name=picture]');
			this.collection.create({name: $name.val(), bio: $bio.val(), picture: $picture.val()}, {wait: true, success: function() { this.trigger('create'); }.bind(this.collection)});
		}
	});

	var NotificationsView = Backbone.View.extend({
		template: Handlebars.compile($("#notification-template").html()),
		initialize: function() {
			this.listenTo(this.collection, 'remove', this.renderSuccess);
			this.listenTo(this.collection, 'error', this.renderError);
		},
		renderSuccess: function() {
			this.render('Everything went fine', 'secondary');
		},
		renderError: function() {
			this.render('Something went wrong', 'alert');
		},
		render: _.throttle(function(message, clazz) {
			var $message = $(this.template(message)).addClass(clazz);
			this.$el.append($message);
			$message.on('click .close', function(e) {
				e.preventDefault();
				$message.remove();
			})

			_.delay(function() {
				$message.fadeOut(300, function() { $message.remove(); });
			}.bind(this), 1700);
		}, 2000)
	});

	var NavView = Backbone.View.extend({
		el: 'nav',
		events: {
			'click .js-creation': 'create',
			'click .js-login': 'login',
			'click h3': 'home'
		},
		home: function(e) {
			this.navigate(e, '');
		},
		create: function(e) {
			this.navigate(e, 'creation');
		},
		login: function(e) {
			this.navigate(e, 'login');
		},
		navigate: function(e, route) {
			e.preventDefault();
			Backbone.history.navigate(route, {trigger: true});
		}
	});

	var LoginView = Backbone.View.extend({
		templateLogin: Handlebars.compile($("#login-template").html()),
		templateLogged: Handlebars.compile($("#logged-template").html()),
		events: {
			'submit': 'submit',
			'click .js-logout': 'logout'
		},
		initialize: function() {
			this.model
				.fetch()
				.done(this.renderLogged.bind(this))
				.fail(this.renderLogin.bind(this));
		},
		renderLogged: function() {
			this.$el.html(this.templateLogged(this.model.toJSON()));
		},
		renderLogin: function() {
			this.$el.html(this.templateLogin());
		},
		submit: function(e) {
			e.preventDefault();
			var name = this.$('input[name=name]').val();
			var password = this.$('input[name=password]').val();
			this.model
				.save({name: name, password: password, sign: true})
				.done(this.renderLogged.bind(this));
		},
		logout: function(e) {
			e.preventDefault();
			this.model
				.set({sign: true})
				.destroy()
				.done(this.renderLogin.bind(this));
		}
	});

	var LayoutView = Backbone.View.extend({
		el: '#layout-element',
		template: Handlebars.compile($("#layout-template").html()),
		render: function(type) {
			this.$el.html(this.template());

			var musicians = new Musicians();
			var notificationsView = new NotificationsView({el: '.js-notification', collection: musicians});

			switch(type) {
			case 'home': 
				new MusiciansView({el: '.js-main', collection: musicians});
			break;
			case 'creation':
				new MusiciansCreationView({el: '.js-main', collection: musicians});
			break;
			case 'login':
				new LoginView({el: '.js-main', model: user});
			break;
			}
		}
	});

	var Router = Backbone.Router.extend({
		routes: {
			"creation": "creation",
			"login": "login",
			"*path": "home"
		},
		creation: function() {
			new LayoutView().render('creation');
		},
		login: function() {
			new LayoutView().render('login');
		},
		home: function() {
			new LayoutView().render('home');
		}
	});	

	new NavView();
	new Router();

	Backbone.history.start();
});
