var thundertick = require('../thundertick.js');
var sinon = require('sinon');
var should = require("should");
var testExtension = require('./extension.js');



describe("Test that chrome api messages are being sent at the right times", ()=>{

	beforeEach(function(){
		global.chrome = require('sinon-chrome');
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

	it("should connect to thundertick during construction of the extension", function(done){
		var spy = sinon.spy(global.chrome.runtime.connect);
		var t = new thundertick(testExtension);
		spy.should.be.called;
		done();
	});
});