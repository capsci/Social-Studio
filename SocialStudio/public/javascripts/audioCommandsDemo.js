$(document).ready(function() {

	console.log("In audioCommandsDemo.js");

	var selector = window.selector;

	hashtable.initialize();


	$("#synthesize").click(function(){
		string = $("#command").val();
		tokens = utilities.split(string).filter(function(item) {
			return hashtable.get(item.toLowerCase()) != undefined;
		});

		tokens.map(function(action) {
			performAction(action);
		});

	});

	function performAction(action) {
		switch(action) {
			case "up":
				selector.moveUp();
				console.log("Moving Up");
				break;
			case "down":
				console.log("Moving Down");
				break;
			case "top":
				console.log("Moving Top");
				break;
			case "bottom":
				console.log("Moving Left");
				break;
			case "left":
				console.log("Moving Left");
				break;
			case "right":
				console.log("Moving Right");
				break;
			case "retweet":
				console.log("Retweet");
				break;
			case "star":
				console.log("Star Tweet");
				break;
			case "reply":
				console.log("Reply");
				break;
			default:
				console.log("No action mapped to this command.")
				break;
		}
	}

});



var utilities = {
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