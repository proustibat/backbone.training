"use strict";

$(function() {
	var Musicians = Backbone.Collection.extend({
		url: '/musician',
		model: Backbone.Model.extend({
			urlRoot: '/musician'
		})
	});

	var MusiciansView = Backbone.View.extend({
		template: Handlebars.compile($("#musician-template").html()),
		initialize: function() {
			this.collection.fetch();
			this.listenTo(this.collection, 'sync', this.render);
		},
		render: function() {
			this.$el.html('');
			
			var $row;
			this.collection.each(function(model, index) {
				if(index % 3 === 0) {
					$row = $('<div class="row">');
					this.$el.append($row);
				}

				$row.append(this.template(model.toJSON()));
			}, this);
		}
	});

	var musicians = new Musicians();
	var musiciansView = new MusiciansView({el: '.js-main', collection: musicians})
});
