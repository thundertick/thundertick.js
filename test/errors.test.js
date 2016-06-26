global.chrome = require('sinon-chrome');
var thundertick = require('../thundertick.js');
var sinon = require('sinon');
var should = require("should");
var testExtension = require('./extension.js');




describe("Test thundertick errors", ()=>{
	beforeEach(function(){
		testExtension.reset();
	});

	it("should throw error for missing options", function(done){
		testExtension.regex = undefined;
		(function(){
			new thundertick(testExtension)
		}).should.throw("Missing required options");
		done();
	});

	it("should throw error for invalid types in regex options", function(done){
		testExtension.regex = /test\sregex/;
		(function(){
			new thundertick(testExtension)
		}).should.throw("Regex and answerRegex have to be defined as strings");
		
		testExtension.reset();
		testExtension.answerRegex = /test/;
		(function(){
			new thundertick(testExtension)
		}).should.throw("Regex and answerRegex have to be defined as strings");

		done();
	});

});
