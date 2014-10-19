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
		events: {
			'mouseover': 'showDelete',
			'mouseleave': 'hideDelete',
			'click': 'delete'
		},
		initialize: function() {
			this.$el.html(this.template(this.model.toJSON()));
		},
		showDelete: function() {
			this.$('.columns').addClass('delete');
		},
		hideDelete: function() {
			this.$('.columns').removeClass('delete');
		},
		delete: function() {
			this.model.destroy({wait: true}).done(_.bind(this.remove, this));
		}
	});

	var MusiciansView = Backbone.View.extend({
		initialize: function() {
			this.collection.fetch();
			this.listenTo(this.collection, 'sync remove', this.render);
		},
		render: function() {
			this.$el.html('');
			
			var $row;
			this.collection.each(function(model, index) {
				if(index % 3 === 0) {
					$row = $('<div class="row">');
					this.$el.append($row);
				}

				$row.append(new MusicianView({model: model}).el);
			}, this);
		}
	});

	var NotificationsView = Backbone.View.extend({
		template: Handlebars.compile($("#notification-template").html()),
		initialize: function() {
			this.listenTo(this.collection, 'remove', this.renderSuccess);
			this.listenTo(this.collection, 'error', this.renderError);
		},
		renderSuccess: function() {
			this.render('Everything went fine', 'secondary');
		},
		renderError: function() {
			this.render('Something went wrong', 'alert');
		},
		render: _.throttle(function(message, clazz) {
			var $message = $(this.template(message)).addClass(clazz);
			this.$el.append($message);
			$message.on('click .close', function(e) {
				e.preventDefault();
				$message.remove();
			})

			_.delay(function() {
				$message.fadeOut(300, function() { $message.remove(); });
			}.bind(this), 1700);
		}, 2000)
	});

	var musicians = new Musicians();
	var musiciansView = new MusiciansView({el: '.js-main', collection: musicians})
	var notificationsView = new NotificationsView({el: '.js-notification', collection: musicians});
});
