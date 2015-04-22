define(function(require) {
	var Backbone = require('backbone');
	
	var User = Backbone.Model.extend({
		initialize: function() {
			this.on('sync', this.notNewAnymore);
			this.on('destroy', this.newAgain);
			this.listenTo(Backbone, 'logged', function() {
				this.notNewAnymore();
				this.fetch().done(this.trigger.bind(this, 'logged'));
			});
		},
		notNewAnymore: function() {
			this.set('id', 0);
		},
		newAgain: function() {
			this.unset('id');
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