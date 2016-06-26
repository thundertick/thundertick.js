global.chrome = require('sinon-chrome');
var thundertick = require('../thundertick.js');
var sinon = require('sinon');
var should = require("should");
var testExtension = require('./extension.js');




describe("Test thundertick errors", ()=>{

	beforeEach(function(){
		testExtension.reset();

		var portStub = {
			onMessage:{
				listeners:[],
				addListener:function(f){
					this.listeners.push(f);
				}
			},
			postMessage:function(q){
				return q;
			},
			triggerMessage:function(q){
				for(var i in this.onMessage.listeners){
					this.onMessage.listeners[i](q);
				}
			}
		}
		chrome.runtime.connect.returns(portStub);
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

	it("should throw error for returning results not in an array", function(done){

		testExtension.search = function(q, cb){
			cb('test');
		}
		var p = new thundertick(testExtension);

		(function(){
			p.chromePort.triggerMessage({
				type:'search-query',
				body:{
					query:'abc'
				}
			});
		})
		.should.throw("Search function should return an array");

		done();
	});


	it("should throw error for returning results in an invalid format", function(done){

		testExtension.search = function(q, cb){
			cb([{
				name:"test"
			}]);
		}

		var p = new thundertick(testExtension);
		(function(){
			p.chromePort.triggerMessage({
				type:'search-query',
				body:{
					query:'abc'
				}
			});
		})
		.should.throw("You are missing certain attributes in your results");

		done();
	});

});
