define(function(require) {
	var Handlebars = require('handlebars'); 
	var Backbone = require('backbone'); 

	Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
		return lvalue != rvalue ? options.inverse(this) : options.fn(this);
	});

	var _sync = Backbone.sync;
	Backbone.sync = function(method, model, options) {
    	var _error = options.error;
    	options.error = function(xhr, status, error) {
    		if(model.handleErrors)
    			_error(xhr, status, error);
    		else
           		Backbone.trigger('notification:failure', xhr.statusText ? xhr.statusText : 'Something went wrong');
        }
    	return _sync(method, model, options);
    };
});