define(function(require) {
	var Backbone = require('backbone');
	
	return Backbone.View.extend({
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
});