"use strict";

var MusiciansViews = Backbone.View.extend({
    events: {

    },
    initialize: function() {
        console.log('MusiciansViews.initialize');
        // this.template = $("#musicians-list-template").html();
        this.template = Handlebars.compile($("#musicians-list-template").html());

        // 1. Ecouteurs
        // this.listenTo(this.collection, 'sync', this.render);
        // this.collection.fetch();

        // 2. Sauvegarde le contexte
        // var self = this;
        // this.collection.fetch().done(function(){
        //     self.render();
        // });

        // 3. bind contexte (incompatible anciens navigateurs)
        // this.collection.fetch().done(this.render.bind(this));

        // 4. bind contexte via underscore
        this.collection.fetch().done(_.bind(this.render,this));
    },

    render: function() {
        console.log('MusiciansViews.render');
        // console.log('collection data : ', this.collection.toJSON());
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

//
    var musicianViews = new MusiciansViews({
        el: ".js-musicians-list",
        collection: musicianCollection
    });

    // musicianCollection.fetch().done(function(){
    //     console.log('List found ');
    // });
});
