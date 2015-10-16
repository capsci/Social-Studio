console.log("client.socket.io.js")


function createTweetNode(tweet) {
	var newtweet = document.createElement('tweet_id');
	newtweet.className += 'new-tweet';
	var avatar = document.createElement('span');
	avatar.className += 'avatar';
	var image = document.createElement('img');
	image.src = tweet.user.profile_image_url;
	avatar.appendChild(image);
	newtweet.appendChild(avatar);
	var bubble = document.createElement('span');
	bubble.className += 'bubble-container';
	var new_twit = document.createElement('div');
	new_twit.className += 'tweet';
	var screen_name = document.createElement('screen_name');
	screen_name.appendChild(document.createTextNode('@' + tweet.user.screen_name));
	var tweet_text = document.createElement('tweet_text');
	tweet_text.appendChild(document.createTextNode(tweet.text));
	new_twit.appendChild(screen_name);
	new_twit.appendChild(tweet_text);
	bubble.appendChild(new_twit);
	newtweet.appendChild(bubble);
	return newtweet;
}

function display_tweet(tweet) {
	newTweet = createTweetNode(tweet);
	var twitter_console = document.getElementById('twitter_feed_content');
	twitter_console.appendChild(newTweet);
}


$(document).ready(function() {

	var server_name = "http://127.0.0.1:3000";
	var server = io.connect(server_name);
	console.log('Client: Connecting to server ' + server_name);


	server.on('tweet', function(data) {
		display_tweet(data.tweet);
	});


	setTimeout(function() {
		highlight.first("twitter_feed_content", "tweet_id");	
	}, 3000);


});