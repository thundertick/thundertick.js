new function(){


	function ThundertickExtension(opts){
		if(!opts.regex || !opts.answerRegex || !opts.search || !opts.suggestion){
			throw new Error("Missing required options");
		}
		if(typeof opts.regex != 'string' || typeof opts.answerRegex != 'string'){
			throw new Error("Regex and answerRegex have to be defined as strings");
		}
		//Register Extension with thundertick
		const THUNDERTICK = "flgjiafbioledndgpeamhfoipgldgmca";
		this.chromePort = chrome.runtime.connect(THUNDERTICK);

		var debug = false;
		var regex = opts.regex;
		var answerRegex = opts.answerRegex;
		var search = opts.search;
		var suggestion = opts.suggestion;
		var log = function(a){
			if(debug){
				console.log(a);
			}
		}
		//Setup debug logger
		if(!opts.debug){
			debug = false;
		} else {
			debug = true;
		}

		//Add search query listener
		this.chromePort.onMessage.addListener(function(req){
			log(req);
			if(req.type == "search-query"){
				var callback = function(results){
					if(!Array.isArray(results)){
						throw new Error("Search function should return an array");
					} else {
						for(var i in results){
							var result = results[i];
							if(!result.name || !result.content || !result.title){
								throw new Error("You are missing certain attributes in your results");
							}
						}
						this.chromePort.postMessage({
							type:"results",
							body:{
								results:results
							}
						});
					}
				}.bind(this);

				search(req.body.query, callback);
			}
		}.bind(this));

		//Add response selection listener
		this.chromePort.onMessage.addListener(function(req){
			if(req.type == "search-selection"){
				suggestion(req.body.query);
			}
		});

		this.chromePort.onMessage.addListener(function(req){
			if(req.type == "error"){
				throw new Error(req.body.error);
			}
		});

		//Registers Extension
		this.chromePort.postMessage({
			type:"registration",
			body:{
			    regex:regex,
		    	answerRegex:answerRegex
			}
		});

		return this;
	}

	if(typeof module != 'undefined' && typeof module.exports != 'undefined'){
		module.exports = ThundertickExtension;
	} else {
		window.Thundertick = ThundertickExtension;
	}


}();