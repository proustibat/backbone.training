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

	it('should click on a face', function(done){
		expect(select('.js-notification .alert-box')).to.have.length(0);

		click('.face:first');
		browser.wait(selectFirst.bind(null, '.js-notification .alert-box'), 
		function() {
			expect(select('.js-notification .alert-box')).to.have.length(1);
			expect(browser.text('.js-notification')).to.contain('error');
			done();	
		});
	});
});

function select(select) {
	return browser.querySelectorAll(select);
}

function selectFirst(select) {
	return browser.querySelector(select);	
}

function click(select) {
	return browser.window.$(select).click();
}