"use strict";

$(function() {
	var Musicians = Backbone.Collection.extend({
		url: '/musician',
		model: Backbone.Model.extend({
			urlRoot: '/musician'
		})
	});

	var MusicianView = Backbone.View.extend({
		template: Handlebars.compile($("#musician-template").html()),
		initialize: function() {
			this.$el.html(this.template(this.model.toJSON()));
		}
	});

	var MusiciansView = Backbone.View.extend({
		initialize: function() {
			this.collection.fetch();
			this.listenTo(this.collection, 'sync', this.render);
		},
		render: function() {
			this.$el.html('');
			
			this.collection.each(function(model, index) {
				var child = new MusicianView({model: model});
				this.$el.append(child.el);
			}, this);
		}
	});

	var musicians = new Musicians();
	var musiciansView = new MusiciansView({el: '.js-main', collection: musicians})
});
