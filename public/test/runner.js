require.config({
	baseUrl: '../js',
	paths: {
			jquery: '../bower_components/jquery/dist/jquery',
			underscore: '../bower_components/underscore/underscore',
			backbone: '../bower_components/backbone/backbone',
			handlebars: '../bower_components/handlebars/handlebars',
			text: '../bower_components/requirejs-text/text',
			
			sinon: '../bower_components/sinon/lib/sinon'
	},
	shim: {
			backbone: { deps: ['jquery', 'underscore'], exports: 'Backbone' },
			underscore: { exports: '_' },
			handlebars: { exports: 'Handlebars'}
	}
});

// PhantomJS doesn't support bind yet, https://github.com/ariya/phantomjs/issues/10522
Function.prototype.bind = Function.prototype.bind || function (thisp) {
    var fn = this;
    return function () {
        return fn.apply(thisp, arguments);
    };
}; 

require([
	'musicians/MusiciansTest.js',
	'UserTest.js'
], function() {
	if (window.mochaPhantomJS)
		mochaPhantomJS.run();
	else
		mocha.run();
});