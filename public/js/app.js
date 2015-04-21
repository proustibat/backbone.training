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
        this.template = Handlebars.compile($("#musicians-list-template").html());
        this.render();
    },
    onHoverHandler: function(e) {
        console.log('toggle');
        this.$(".columns").toggleClass('delete');
    },

    onClickHandler: function(e) {
        this.model.destroy({
                wait: true, // envoie le succès qu'après confirmation par le serveur
                success: function(model, response) {
                console.log("mode destroyed");
            }.bind(this)
        });
    },
    render: function() {
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
    }
});


var NotificationView = Backbone.View.extend({

    events: {
        "click .close": "onClose"
    },

    initialize: function() {
        this.template = Handlebars.compile($("#notification-template").html());
        this.listenTo(this.collection, 'destroy', this.render.bind(this, 'success'));
        this.listenTo(this.collection, 'error', this.render.bind(this, 'failure'));
        // this.render();
    },

    onClose: function() {
        console.log('onclose');
        this.$el.hide();
    },

    render: function(state) {
        var message = "It's ok",
            clazz = 'secondary';

        if(state==="failure") {
            message = "Problem ";
            clazz = "alert ";
        }

        var $message = $(this.template(message)).addClass(clazz);
        this.$el.hide().html($message).fadeIn();
        // setTimeout(function() {
        //     this.$el.fadeOut();
        // }.bind(this), 2000);
        this.hide();
    },
    hide: _.debounce(function() {
        this.$el.fadeOut();
    }, 5000)

});


var LayoutView = Backbone.View.extend({

    initialize: function() {
        console.log('initialize LayoutView');
        this.template = Handlebars.compile($("#layout-template").html());
        this.render();
    },

    render: function(pageType) {
        console.log('Render LayoutView');

        this.$el.html(this.template());

        var musicianCollection = new MusicianCollection();

        var notificationView = new NotificationView({
            el: ".js-notification",
            collection: musicianCollection
        });

        switch(pageType) {
            case 'home':
            console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHH');
                var musiciansViews = new MusiciansViews({
                    el: ".js-musicians-list",
                    collection: musicianCollection
                });
                break;
            case 'add':
                console.log('ADDDDDDDDDDDDDDDDDDDDDDDD');
                break;
            case 'login':
                break;
            }
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

var Router = Backbone.Router.extend({

    routes: {
        "login": "login",
        "add": "add",
        "*path": "home"
    },

    initialize: function() {
        console.log('ROUTER INIT');

        this.layoutView = new LayoutView({
            el: ".js-layout-element"
        });

    },

    home: function() {
        console.log('ROUTE HOME');
        this.layoutView.render('home');
    },

    login: function() {
        console.log('ROUTE LOGIN');
        this.layoutView.render('login');
    },

    add: function() {
        console.log("ROUTE ADD");
        this.layoutView.render('add');
    }
});





$(document).ready(function() {

    // écoute de la navigation
    $(".button-group .button").on("click", function(e) {
        e.preventDefault();
        Backbone.history.navigate($(this).attr("href"), {trigger: true});
    });

    var router = new Router();
    Backbone.history.start();

});
