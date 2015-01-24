define(function(require) {
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars'); 
	var tipper = require('tipper'); 
	
	var MusicianView = require('./MusicianView')

	return Marionette.CompositeView.extend({
		template: require('text!../templates/musician-filter-template.html'),
		templateHelpers: function() {
			return { criteria: this.criteria };
		},
		initialize: function(options) {
			this.criteria = options.criteria || 'All';
			this.collection.fetch();
		},
		events: {
			'click .sub-nav a': 'filter'
		},
		collectionEvents: {
			'sync remove': 'filter'
		},
		childView: MusicianView,
		childViewContainer: '.rows',
		onDomRefresh: function() {
			this.$('dt').tipper({direction: 'top'});
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
});