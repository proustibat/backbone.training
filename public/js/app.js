"use strict";

var MusiciansViews = Backbone.View.extend({
    className: 'row',
    initialize: function() {
        console.log('MusiciansViews.initialize');
        // écoute et lit la collection
        this.listenTo(this.collection, 'sync destroy', this.render);
        this.collection.fetch();
    },

    render: function() {
        console.log('MusiciansViews.render');
        var $template = "";
        this.$el.html("");
        this.collection.each(function(model) {
            var child = new MusicianView({ model: model });
            this.$el.append(child.el);
        }.bind(this));
    }
});

var MusicianView = Backbone.View.extend({

    events: {
        "mouseenter .columns": "onHoverHandler",
        "mouseleave .columns": "onHoverHandler",
        "click .columns": "onClickHandler"
    },

    initialize: function() {
        console.log('MusicianView.initialize');
        this.template = Handlebars.compile($("#musicians-list-template").html());
        this.render();
    },
    onHoverHandler: function(e) {
        console.log('toggle');
        this.$(".columns").toggleClass('delete');
    },

    onClickHandler: function(e) {
        this.model.destroy({
                success: function(model, response) {
                console.log("DESTROYED");
                console.log('this : ', this);
            }.bind(this)
        });
    },
    render: function() {
        console.log('MusicianView.render');
        console.log('this.model : ', this.model.toJSON());
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
    }
});

var MusicianCollection = Backbone.Collection.extend({
    url: "/musician",
    initialize: function() {
        console.log('MusicianCollection.initialize');
    },
    render: function() {

    }
});



$(document).ready(function() {

    var musicianCollection = new MusicianCollection();

    var musiciansViews = new MusiciansViews({
        el: ".js-musicians-list",
        collection: musicianCollection
    });

    // musicianCollection.fetch().done(function(){
    //     console.log('List found ');
    // });
});
