define(function(require) {
	var expect = require('chai').expect;
	var Musicians = require('./Musicians');

	describe('Musicians', function() {

		var musicians;
		beforeEach(function() {
			musicians = new Musicians([
				{name: "John Lennon", bio: "John Ono Lennon was a Beatles"},
				{name: "Paul McCartney", bio: "Sir James Paul McCartney is a Beatles"},
				{name: "Jim Morrisson", bio: "James Douglas 'Jim' Morrison was a Doors"},
				{name: "Robert Plant", bio: "Robert Anthony Plant is a Led Zeppelin"},
			]);
		});

		it('should be filtered', function() {
			expect(musicians).to.have.length(4);
			expect(musicians.filterBy('Beatles')).to.have.length(2);
			expect(musicians.filterBy('Doors')).to.have.length(1);
			expect(musicians.filterBy('All')).to.have.length(4);
		});

		it('should add a valid model', function() {
			expect(musicians).to.have.length(4);

			musicians.add({name: "Joe Dassin", bio: "L'amérique"}, {validate: true});
			expect(musicians).to.have.length(5);
		});

		it('should refuse to add an invalid model', function(done) {
			expect(musicians).to.have.length(4);

			musicians.add({name: "Jo", bio: "L'amérique"}, {validate: true});
			musicians.on('invalid', function() {
				expect(musicians).to.have.length(4);
				done();
			});
		});
	});
});