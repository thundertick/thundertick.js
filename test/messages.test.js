global.chrome = require('sinon-chrome');
var thundertick = require('../thundertick.js');
var sinon = require('sinon');
var should = require("should");

require('should-sinon');

var testExtension = {};


describe("Test that chrome api messages are being sent at the right times", ()=>{

	beforeEach(function(){
		delete require.cache['./extension.js'];
		testExtension = require('./extension.js');
		testExtension.reset();
		var portStub = {
			onMessage:{
				listeners:[],
				addListener:function(f){
					this.listeners.push(f);
				}
			},
			onDisconnect:{
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
		chrome.runtime.connect.reset();
		chrome.runtime.connect.returns(portStub);
	});

	it("should connect to thundertick during construction of the extension", function(done){
		var t = new thundertick(testExtension);
		chrome.runtime.connect.should.be.calledWith("flgjiafbioledndgpeamhfoipgldgmca");
		done();
	});

	it("should respond with results to a query", function(done){
		var p = new thundertick(testExtension);
		var spy = sinon.spy(p.chromePort, "postMessage");
		p.chromePort.triggerMessage({
			type:'search-query',
			body:{
				query:'abc'
			}
		});
		spy.should.be.calledOnce();
		done();
	});

	it("should reconnect to thundertick if disconnected", function(done){
		this.timeout(5000);
		var p = new thundertick(testExtension);
		for(var i in p.chromePort.onDisconnect.listeners){
			p.chromePort.onDisconnect.listeners[i]();
		}
		setTimeout(function(){
			chrome.runtime.connect.should.be.calledTwice();
			done();
		},2000);
	});

});