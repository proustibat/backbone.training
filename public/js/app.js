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
            var child = new MusicianView({
                model: model
            });
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

        if (state === "failure") {
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

        switch (pageType) {
            case 'home':
                var musiciansViews = new MusiciansViews({
                    collection: musicianCollection
                });
                this.$(".js-main-page").html(musiciansViews.el);
                break;
            case 'add':
                var musiciansCreationView = new MusiciansCreationView({
                    collection: musicianCollection
                });
                this.$(".js-main-page").html(musiciansCreationView.el);
                break;
            case 'login':
                var loginView = new LoginView({
                    collection: musicianCollection,
                    model: user
                });
                this.$(".js-main-page").html(loginView.el);
                break;
        }
    }
});


var MusiciansCreationView = Backbone.View.extend({
    pictureView: null,
    events: {
        "submit": "submit"
    },
    initialize: function() {
        this.template = Handlebars.compile($("#musician-creation-template").html());
        this.render();
        var picturesCollection = new PicturesCollection();
        this.pictureView = new PicturesView({
            // el: ".js-musician-faces",
            collection: picturesCollection
        });
        // attache le contenu dans le noeud parce que la vue parente n'est pas encore rendue
        this.$(".js-musician-faces").html(this.pictureView.el);
    },
    submit: function(e) {
        e.preventDefault();
        console.log('SUBMIT');
        var $name = this.$("input[name=name]");
        var $bio = this.$("textarea[name=bio]");
        var $picture = this.$("input[name=picture]");
        this.collection.create({
            name: $name.val(),
            bio: $bio.val(),
            picture: $picture.val()
        }, {
            wait: true,
            success: function() {
                console.log('SUCCESS CREATE');
                $name.val('');
                $bio.val('');
                $picture.val('');
                // this.render();
            }.bind(this),
            error: function() {
                console.log('ERROR CREATE');
            }
        });
    },
    render: function() {
        this.$el.html(this.template());
    }
});

var User = Backbone.Model.extend({
    initialize: function() {
        this.on('sync', this.notNewAnymore);
    },
    notNewAnymore: function() {
        this.set('id', 0);
    },
    url: function() {
        var url = '/user';
        if (this.has('sign')) {
            this.unset('sign');
            url += '/signin';
        }
        return url;
    }
});
var user = new User();

var LoginView = Backbone.View.extend({
    templateLogin: null,
    templateLogged: null,
    events: {
        'submit': 'submit',
        'click .js-logout': 'logout'
    },
    initialize: function() {
        this.templateLogin = Handlebars.compile($("#login-template").html());
        this.templateLogged = Handlebars.compile($("#logged-template").html());
        this.model.fetch()
            .done(this.renderLogged.bind(this))
            .fail(this.renderLogin.bind(this));
    },
    renderLogged: function() {
        this.$el.html(this.templateLogged(this.model.toJSON()));
    },
    renderLogin: function() {
        this.$el.html(this.templateLogin());
    },
    submit: function(e) {
        e.preventDefault();
        var name = this.$('input[name=name]').val();
        var password = this.$('input[name=password]').val();
        this.model
            .save({
                name: name,
                password: password,
                sign: true
            })
            .done(this.renderLogged.bind(this));
    },
    logout: function(e) {
        e.preventDefault();
        this.model.set({ sign: true }).destroy().done(
            this.renderLogin.bind(this)
        );
    }
});



var PicturesView = Backbone.View.extend({
    initialize: function() {
        // this.template = Handlebars.compile($("#musician-faces-template").html());
        this.listenTo(this.collection, 'sync', this.render);
        console.log('PICTURESVIEW INIT');
        this.collection.fetch();
        this.render();
    },
    render: function() {
        console.log('PICTURESVIEW RENDER : ');

        var $template = "";
        this.$el.html("");
        this.collection.each(function(picture) {
            // console.log(picture);
            var child = new PictureView({
                model: picture
            });
            this.listenTo(child, "pictureSelected", this.onPictureSelected);
            this.$el.append(child.el);
        }.bind(this));


        // this.$el.html(this.template());
    },
    onPictureSelected: function(pictureModel) {
        console.log("PICTURE SELECTED ");
        this.$("img").removeClass("selected");
        var $input = this.$el.closest('form').find('input[name=picture]');
        $input.val(pictureModel.get('picture'));
        console.log('===>', pictureModel.get('picture'));
    }
});

var PictureView = Backbone.View.extend({
    events: {
        "click img": "select"
    },
    initialize: function() {
        this.template = Handlebars.compile($("#musician-faces-template").html());
        this.render();
    },
    select: function(e) {
        this.trigger("pictureSelected", this.model);
        $(e.currentTarget).addClass("selected");
    },
    render: function() {
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
    }
});

var MusicianCollection = Backbone.Collection.extend({
    url: "/musician",
    initialize: function() {}
});

var PicturesCollection = Backbone.Collection.extend({
    url: "/picture",
    initialize: function() {
        console.log('PICTURESCOLLECTION INIT');
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
        Backbone.history.navigate($(this).attr("href"), {
            trigger: true
        });
    });

    var router = new Router();
    Backbone.history.start();

});
