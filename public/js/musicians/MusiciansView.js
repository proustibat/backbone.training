define(function(require) {
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var tipper = require('tipper');
	var Radio = require('radio');
	var socket = require('../Socket');

	var MusicianView = require('./MusicianView')

	return Marionette.CompositeView.extend({
		template: require('text!../templates/musician-filter-template.html'),
		templateHelpers: function() {
			return { criteria: this.criteria };
		},
		initialize: function(options) {
			Radio.channel('musician').reply('delete', this.grantDeletion.bind(this));

			socket.on('musician', function (musician) {
				var model = this.collection.findWhere({id: musician.id});
				if(model)
					model.set(musician);
			}.bind(this));

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
		},
		grantDeletion: function(model) {
			var famous = ['Floyd', 'Beatles', 'Zeppelin'];
			var band = _.find(famous, function(item) {
				return model.get('bio').indexOf(item) !== -1;
			});

			if (band) {
				var count = this.collection.filter(function(item) {
					return item.get('bio').indexOf(band) !== -1;
				}).length;

				if (count === 1) {
					Backbone.trigger('notification:failure', 'Something went wrong');
					return false;
				}
			}

			return true;
		}
	});
});
