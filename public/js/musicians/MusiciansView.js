define(function(require) {
	// var Backbone = require('backbone');
	var Marionette = require('marionette');
	var Handlebars = require('handlebars');
	var tipper = require('tipper');
	var Radio = require('radio');

	var MusicianView = require('./MusicianView')

	return Marionette.CompositeView.extend({
		template: require('text!../templates/musician-filter-template.html'),
		childView: MusicianView,
		initialize: function(options) {
			Radio.channel('musician').reply('delete', this.grantDeletion.bind(this));
			this.criteria = options.criteria || 'All';
			this.collection.fetch();
			this.listenTo(this.collection, 'sync remove', this.filter);
			// this.filter();
		},
		events: {
			'click .sub-nav a': 'filter'
		},
		templateHelpers: function() {
			return {
				criteria: this.criteria
			}
		},
		onDomRefresh: function() {
			this.$('dt').tipper({
				direction: 'top'
			});
		},
		// render: function() {
		// 	this.$el.html(this.template(this.criteria));
		// 	this.$('dt').tipper({direction: 'top'});

		// 	var $row;
		// 	this.collection.each(function(model, index) {
		// 		if(index % 3 === 0) {
		// 			$row = $('<div class="row">');
		// 			this.$el.append($row);
		// 		}

		// 		$row.append(new MusicianView({model: model}).el);
		// 	}, this);
		// },

		filter: function(e) {
			console.log('FILTER');
			if (e && e.preventDefault) {
				e.preventDefault();
				this.criteria = $(e.currentTarget).html();
			}

			if (!this.original)
				this.original = this.collection;

			this.collection = this.original.filterBy(this.criteria);
			Backbone.history.navigate('?filter=' + this.criteria);

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
