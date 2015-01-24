define(function(require) {
	var Marionette = require('marionette'); 
	var Handlebars = require('handlebars'); 
	
	var user = require('./User');
	var NotificationsView = require('./NotificationsView');
	var LoginView = require('./LoginView');

	var Musicians = require('./musicians/Musicians');
	var MusiciansView = require('./musicians/MusiciansView');
	var MusiciansCreationView = require('./musicians/MusiciansCreationView');

	return Marionette.LayoutView.extend({
		el: '#layout-element',
		template: require('text!./templates/layout-template.html'),
		regions: {
			main: '.js-main',
			notification: '.js-notification'
		},
		onRender: function(){
			this.notification.show(new NotificationsView());
		},
		show: function(type, query) {
			var musicians = new Musicians();
			
			switch(type) {
			case 'home': 
				this.main.show(new MusiciansView({collection: musicians, criteria: query.filter}));
			break;
			case 'creation':
				this.main.show(new MusiciansCreationView({collection: musicians}));
			break;
			case 'login':
				this.main.show(new LoginView({model: user}));
			break;
			}
		}
	});
});