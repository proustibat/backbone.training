"use strict";

$(function() {
	var MusicianView = Backbone.View.extend({
		template: Handlebars.compile($("#musician-template").html()),
		initialize: function() {
			this.$el.html(this.template());
		}
	});

	var musicianView = new MusicianView({el: '.js-main'})
});
