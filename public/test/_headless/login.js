var expect = require('chai').expect,
Browser = require('zombie'),
browser = new Browser();

// Browser.debug();

var port = process.env.PORT || 3000;

describe('Welcome', function(){
	beforeEach(function(done) {
		browser.visit('http://127.0.0.1:'+port+'/', function() {
			browser.wait(selectFirst.bind(null, '.face'), done);
		});
	});

	it('should display 9 faces', function(){
		expect(select('.face')).to.have.length(9);
	});
});

function select(select) {
	return browser.querySelectorAll(select);
}

function selectFirst(select) {
	return browser.querySelector(select);	
}