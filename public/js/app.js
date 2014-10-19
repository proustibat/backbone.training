"use strict";

$(function() {
	var MusiciansView = Backbone.View.extend({
		template: Handlebars.compile($("#musician-template").html()),
		initialize: function() {
			this.$el.html(this.template());
		}
	});

	var musiciansView = new MusiciansView({el: '.js-main'})
});
