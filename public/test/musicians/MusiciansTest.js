define(function(require) {
	var Musicians = require('./Musicians');

	describe('Musicians', function() {
		it('should refuse to add an invalid model', function() {
			expect(Musicians).to.be.not.null;
		});
	});
});