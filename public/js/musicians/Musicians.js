define(function(require){
	var Backbone = require('backbone');

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

	return Musicians;
});