define(function(require) {
	var Backbone = require('backbone');
	
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

	return new User();
});