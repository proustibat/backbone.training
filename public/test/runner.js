require.config({
    baseUrl: '../js',
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone/backbone',
        handlebars: '../bower_components/handlebars/handlebars',
        text: '../bower_components/requirejs-text/text',

        mocha: '../bower_components/mocha/mocha',
        chai: '../bower_components/chai/chai'
    },
    shim: {
        backbone: { deps: ['jquery', 'underscore'], exports: 'Backbone' },
        underscore: { exports: '_' },
        handlebars: { exports: 'Handlebars'},
        
        mocha: { exports: 'mocha' }
    }
});
 
define(function(require) {
  var mocha = require('mocha');
  mocha.setup('bdd');
 
  require([
    'musicians/MusiciansTest.js',
  ], function(require) {
    mocha.run();
  });
});