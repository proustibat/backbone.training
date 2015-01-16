define(function(require) {
	var Backbone = require('backbone');
	
	var MusicianFaceView = require('./MusicianFaceView');
	var Pictures = Backbone.Collection.extend({url: '/picture'});

	return Backbone.View.extend({
		initialize: function() {
			this.collection = new Pictures();
			this.collection.fetch().done(this.render.bind(this));
		},
		render: function() {
			var $row = $('<div class="row">');
			this.$el.html($row);
			this.collection.each(function(model) {
				var child = new MusicianFaceView({model: model});
				this.listenTo(child, 'selection', this.selection);
				$row.append(child.el);
			}.bind(this));
		},
		selection: function(model) {
			this.$('img').removeClass('selected');
			var $input = this.$el.closest('form').find('input[name=picture]');
			$input.val(model.get('picture'));
		}
	});
});