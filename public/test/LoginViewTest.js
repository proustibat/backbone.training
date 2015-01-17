define(function(require) {
	var sinon = require('sinon');

	var LoginView = require('./LoginView');
	var user = require('./User');

	describe('LoginView', function() {
		it('should display login form', function() {
			sinon.stub($, 'ajax').returns($.Deferred().reject());

			var loginView = new LoginView({model: user});
			expect(loginView.$el.html()).to.have.string('Please, enter your credentials');
		});

		it('should display logged user', function() {
			sinon.stub($, 'ajax').returns($.Deferred().resolve({name: 'john'}));

			var loginView = new LoginView({model: user});
			expect(loginView.$el.html()).to.have.string('Welcome');
		});

		afterEach(function () {
			$.ajax.restore();
		});
	});
});