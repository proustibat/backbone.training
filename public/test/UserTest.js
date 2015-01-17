define(function(require) {
	var sinon = require('sinon');
	var user = require('./User');

	describe('User', function() {

		it('should be fetch without server', function(done) {
			sinon.stub($, 'ajax').returns($.Deferred().resolve({name: 'john'}));

			user.fetch().done(function(data) {
				expect(data).to.deep.equal({name: 'john'});
				done();
			});
		});

		after(function () {
			$.ajax.restore();
		});
	});
});