define(function(require) {
	var Backbone = require('backbone');
	var Handlebars = require('handlebars'); 
	var tipper = require('tipper'); 
	
	var MusicianView = require('./MusicianView')

	return Backbone.View.extend({
		template: Handlebars.compile(require('text!../templates/musician-filter-template.html')),
		initialize: function(options) {
			this.criteria = options.criteria || 'All';
			this.collection.fetch();
			this.listenTo(this.collection, 'sync remove', this.filter);
		},
		events: {
			'click .sub-nav a': 'filter'
		},
		render: function() {
			this.$el.html(this.template(this.criteria));
			this.$('dt').tipper({direction: 'top'});

			var $row;
			this.collection.each(function(model, index) {
				if(index % 3 === 0) {
					$row = $('<div class="row">');
					this.$el.append($row);
				}

				$row.append(new MusicianView({model: model}).el);
			}, this);
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