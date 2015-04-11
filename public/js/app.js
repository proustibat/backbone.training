"use strict";

require.config({
    baseUrl: './js',
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone/backbone',
        handlebars: '../bower_components/handlebars/handlebars',
        text: '../bower_components/requirejs-text/text',
        tipper: '../bower_components/Tipper/jquery.fs.tipper',
        marionette: '../bower_components/marionette/lib/backbone.marionette',
        radio: '../bower_components/backbone.radio/build/backbone.radio'
    },
    shim: {
        backbone: { deps: ['jquery', 'underscore'], exports: 'Backbone' },
        underscore: { exports: '_' },
        handlebars: { exports: 'Handlebars'},
        tipper: { deps: ['jquery'] },
        marionette: { deps: ["backbone"], exports:"Marionette" },
        radio: { deps: ["backbone"], exports:"Radio" }
    }
});

require(['./Overrides', './NavView', './Router'], function(Overrides, NavView, Router) {
	new NavView();
	new Router();

	Backbone.history.start();
});
