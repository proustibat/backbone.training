"use strict";

var MusiciansViews = Backbone.View.extend({
    events: {
        "mouseenter .columns": "onHoverHandler",
        "mouseleave .columns": "onHoverHandler",
        "click .columns": "onClickHandler"
    },

    initialize: function() {
        console.log('MusiciansViews.initialize');
        this.template = Handlebars.compile($("#musicians-list-template").html());

        // écoute et lit la collection
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch();

        // écoute les suppressions sur les models
        this.listenTo(this.collection, 'remove', this.render);
    },
    onHoverHandler: function(e) {
        $(e.currentTarget).toggleClass('delete');
    },

    onClickHandler: function(e) {
        console.log('onClickHandler');
        console.log(this.collection.models[$(e.currentTarget).index()]);
        this.collection.remove(this.collection.models[$(e.currentTarget).index()]);
    },

    render: function() {
        console.log('MusiciansViews.render');
        // rendu de la vue : avec fonction template qui prend données json
        this.$el.html(this.template(this.collection.toJSON()));
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

    var musicianViews = new MusiciansViews({
        el: ".js-musicians-list",
        collection: musicianCollection
    });

    // musicianCollection.fetch().done(function(){
    //     console.log('List found ');
    // });
});
