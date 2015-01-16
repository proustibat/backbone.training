define(function(require) {
	var Backbone = require('backbone');
	var Handlebars = require('handlebars'); 
	
	var user = require('./User');
	var NotificationsView = require('./NotificationsView');
	var LoginView = require('./LoginView');

	var Musicians = require('./musicians/Musicians');
	var MusiciansView = require('./musicians/MusiciansView');
	var MusiciansCreationView = require('./musicians/MusiciansCreationView');

	return Backbone.View.extend({
		el: '#layout-element',
		template: Handlebars.compile(require('text!./templates/layout-template.html')),
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
});