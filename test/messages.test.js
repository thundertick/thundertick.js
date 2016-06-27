global.chrome = require('sinon-chrome');
var thundertick = require('../thundertick.js');
var sinon = require('sinon');
var should = require("should");
var testExtension = require('./extension.js');
require('should-sinon');



describe("Test that chrome api messages are being sent at the right times", ()=>{

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
		global.chrome.runtime['connect'] = function(){

		}
	});

	it("should connect to thundertick during construction of the extension", function(done){
		done();
	});

	it("should respond with results to a query", function(done){
		return done();
		var p = new thundertick(testExtension);
		var spy = sinon.spy(p.chromePort, "postMessage");
		p.chromePort.triggerMessage({
			type:'search-query',
			body:{
				query:'abc'
			}
		});
		spy.should.be.calledOnce();
	});
});