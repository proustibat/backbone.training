define(function(require) {
	var Backbone = require('backbone');
	var LayoutView = require('./LayoutView');

	return Backbone.Router.extend({
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
			query = _.chain(query ? query.split('&') : '').map(function(params) {
    			var p = params.split('=');
    			return [p[0], decodeURIComponent(p[1])];
  			}).object().value();

			this.LayoutView.render('home', query);
		}
	});	
});