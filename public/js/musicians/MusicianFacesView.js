define(function(require) {
	var Backbone = require('backbone');
	var Marionette = require('marionette');
	
	var MusicianFaceView = require('./MusicianFaceView');
	var Pictures = Backbone.Collection.extend({url: '/picture'});

	return Marionette.CollectionView.extend({
		initialize: function() {
			this.collection = new Pictures();
			this.collection.fetch();
		},
		className: 'row',
		childView: MusicianFaceView,
		childEvents: {
			selection: function(view, model) {
				this.$('img').removeClass('selected');
				var $input = this.$el.closest('form').find('input[name=picture]');
				$input.val(model.get('picture'));
			}
		}
	});
});