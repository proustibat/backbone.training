"use strict";

$(function() {
	Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
		return lvalue != rvalue ? options.inverse(this) : options.fn(this);
	});

	var _sync = Backbone.sync;
	Backbone.sync = function(method, model, options) {
    	var _error = options.error;
    	options.error = function(xhr, status, error) {
    		if(model.handleErrors)
    			_error(xhr, status, error);
    		else
           		Backbone.trigger('notification:failure', xhr.statusText ? xhr.statusText : 'Something went wrong');
        }
    	return _sync(method, model, options);
    };

	var Pictures = Backbone.Collection.extend({url: '/picture'});

	var Musicians = Backbone.Collection.extend({
		url: '/musician',
		filterBy: function(criteria) {
			var filtered = this.filter(function(musician) {
				return criteria === 'All' || 
					musician.get('bio').indexOf(criteria) !== -1;
			});
			return new Musicians(filtered);
		},
		model: Backbone.Model.extend({
			urlRoot: '/musician',
			initialize: function() {
				// https://github.com/jashkenas/backbone/issues/3328
				this.on('invalid', function(model, errors) {
					if (this.collection)
						this.collection.trigger('invalid', model, errors);
				});
			},
			validate: function(attrs, options) {
				return (attrs.name.length < 3) ? ['name'] : undefined;
			}
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
		},
		handleErrors: true
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
			this.model
				.destroy({wait: true})
				.done(function() {
					Backbone.trigger('notification:success', 'Everything went fine');
					this.remove();
				}.bind(this));
		}
	});

	var MusiciansView = Backbone.View.extend({
		template: Handlebars.compile($("#musician-filter-template").html()),
		initialize: function(options) {
			this.criteria = options.criteria || 'All';
			this.collection.fetch();
			this.listenTo(this.collection, 'sync remove', this.filter);
		},
		events: {
			'click .sub-nav a': 'filter'
		},
		render: function() {
			this.$el.html(this.template(this.criteria));

			var $row;
			this.collection.each(function(model, index) {
				if(index % 3 === 0) {
					$row = $('<div class="row">');
					this.$el.append($row);
				}

				$row.append(new MusicianView({model: model}).el);
			}, this);
		},
		filter: function(e) {
			if(e.preventDefault) {
				e.preventDefault();
				this.criteria = $(e.currentTarget).html();
			}

			if(!this.original)
				this.original = this.collection;

			this.collection = this.original.filterBy(this.criteria);
			Backbone.history.navigate('?filter='+this.criteria);

			this.render();
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

			this.childView = new MusiciansFacesView();
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

	var NotificationsView = Backbone.View.extend({
		template: Handlebars.compile($("#notification-template").html()),
		initialize: function() {
			this.listenTo(Backbone, 'notification:success', this.renderSuccess);
			this.listenTo(Backbone, 'notification:failure', this.renderError);
		},
		renderSuccess: function(message) {
			this.render(message, 'secondary');
		},
		renderError: function(message) {
			this.render(message, 'alert');
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
	});

	var LayoutView = Backbone.View.extend({
		el: '#layout-element',
		template: Handlebars.compile($("#layout-template").html()),
		render: function(type, query) {
			this.$el.html(this.template());

			var musicians = new Musicians();

			if(this.child)
				this.child.remove();
			this.child = new NotificationsView();
			$('.js-notification').html(this.child.el);

			switch(type) {
			case 'home': 
				new MusiciansView({el: '.js-main', collection: musicians, criteria: query.filter});
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
		initialize: function() {
			this.LayoutView = new LayoutView();
		},
		creation: function() {
			this.LayoutView.render('creation');
		},
		login: function() {
			this.LayoutView.render('login');
		},
		home: function(route, query) {
			query = _.chain(query.split('&')).map(function(params) {
    			var p = params.split('=');
    			return [p[0], decodeURIComponent(p[1])];
  			}).object().value();

			this.LayoutView.render('home', query);
		}
	});	

	new NavView();
	new Router();

	Backbone.history.start();
});
