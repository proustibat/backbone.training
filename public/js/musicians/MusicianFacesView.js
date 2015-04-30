define(function(require) {
	var Backbone = require('backbone');
	var Marionette = require('marionette');

	var MusicianFaceView = require('./MusicianFaceView');
	var Pictures = Backbone.Collection.extend({
		url: '/picture'
	});

	return Marionette.CollectionView.extend({
		childView: MusicianFaceView,
		childEvents: {
			selection: function(view, model) {
				this.selection(model);
			}
		},
		initialize: function() {
			this.collection = new Pictures();
			this.collection.fetch().done();
		},
		selection: function(model) {
			console.log('allo');
			this.$('img').removeClass('selected');
			var $input = this.$el.closest('form').find('input[name=picture]');
			$input.val(model.get('picture'));
		}
	});
});
