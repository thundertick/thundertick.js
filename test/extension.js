/*
	This is a mock extension outline to be used for tests
	You can reset the object after each test by calling extension.reset();
*/
module.exports = {
	regex:"share",
	answerRegex:"^(share:)(.+)",
	debug:false,
	search:function(query, cb){
		cb([]);
	},
	suggestion: function(query){
		return "successfully used " + query;
	},
	reset: function(){
		this.regex = "share";
		this.answerRegex = "^(share:)(.+)";
		this.debug = false;
		this.search = function(query,cb){
			cb([]);
		}
		this.suggestion = function(query){
			return "successfully used "+ query;
		}
	}
}
