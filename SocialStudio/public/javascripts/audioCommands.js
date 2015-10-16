
$(document).ready(function() {

	console.log("In audioCommands.js");

	var enableAudio = false;

	
	var recognition = new window.webkitSpeechRecognition();

	var i = 0;
	recognition.continuous = true;
	console.log("Now Recording");

	recognition.onresult = function(event) { 
	//	console.log(event)
		var trans = event.results[i][0].transcript;
		var confi = event.results[i][0].confidence;
		console.log(trans);
		console.log(confi); 	
		i = i + 1;
		if(confi >= 0.6) {
			tokens = utilitiesA.split(trans).filter(function(item) {
				return hashtable.get(item.toLowerCase()) != undefined;
			});

			console.log("TOKENS:", tokens);

			tokens.map(function(action) {
				performAction(action);
			});
		}
	}

	$("#audioFeedButton").click(function() {
		enableAudio ? $(this).css("background-color","#FF5555") : $(this).css("background-color","#55FF55");
		enableAudio = enableAudio ? false : true; 
		enableAudio ? recognition.start() : recognition.stop();
		console.log("Audio", enableAudio);
		i = 0;
	});

//	recognition.start();

	var selector = window.selector;

	hashtable.initialize();

	


	$("#synthesize").click(function(){
		string = $("#command").val();
		tokens = utilitiesA.split(string).filter(function(item) {
			return hashtable.get(item.toLowerCase()) != undefined;
		});

		tokens.map(function(action) {
			performAction(action);
		});

	});

	var i = 0;



	function performAction(action) {
		switch(action) {
			case "up":
				selector.moveUp();
				console.log("Moving Up");
				break;
			case "down":
				selector.moveDown();
				console.log("Moving Down");
				break;
			case "top":
				selector.moveTop();
				console.log("Moving Top");
				break;
			case "bottom":
				selector.moveBottom();
				console.log("Moving Bottom");
				break;
			case "left":
				selector.moveLeft();
				console.log("Moving Left");
				break;
			case "right":
				selector.moveRight();
				console.log("Moving Right");
				break;
			case "retweet":
				selector.moveRetweet();
				console.log("Retweet");
				break;
			case "star":
				selector.moveStar();
				console.log("Star Tweet");
				break;
			case "reply":
				selector.moveReply();
				console.log("Reply");
				break;
			default:
				console.log("No action mapped to this command.")
				break;
		}
	}

});



var utilitiesA = {
	split: function(str){
		seps = [' ', '\\\+', '-', '\\\(', '\\\)', '\\*', '/', ':', '\\\?', '\,'].join('|');
		var tokens = str.split(new RegExp(seps, 'g'));
		return tokens;
	}
}

var hashtable = {

	// Dictionary to store data
	table: {},

	// Add elements to hash table
	add: function(key, value) {
		this.table[key] = value;
	},

	// Get values from hash table.
	// Returns null is key doesnot exists
	get: function(key) {
		return this.table[key]?this.table[key]:null;
	},

	// Returns true is the key exists in 
	isPresent: function(key) {
		return this.table[key]?true:false;
	},

	// Prints hash table
	print: function() {
		console.log(this.table);
	},

	// Initialize hash table with given commands
	initialize:  function() {
		this.table["move"] = 100;
		this.table["go"] = 100;
		this.table["up"] = 80;
		this.table["down"] = 80;
		this.table["top"] = 90;
		this.table["bottom"] = 90;
		this.table["right"] = 70;
		this.table["left"] = 70;
		this.table["star"] = 50;
		this.table["retweet"] = 50;
		this.table["reply"] = 50;
	}

}