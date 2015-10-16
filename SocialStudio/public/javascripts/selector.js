
console.log("In selector.js");

var printSom = function() {
	console.log("Print Somethin!!!!!!");
}

var selector = {

	feedsClass: "social_feed",
	feeds: ["facebook", "twitter", "instagram"],
	panels: ["facebook_feed_content", "twitter_feed_content", "instagram_feed_content"],
	posts: ["facebook_id", "tweet_id", "instagram_id"],
	postTag: ["facebook_text","tweet_text","instagram_text"],
	curr: 1,
	selectedPost: "selectedPost",
	selectedFeed: "selectedFeed",

	moveUp: function() {
		items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
		for(var i = 1; i < items.length; i++) {
			if(items[i].classList.contains(this.selectedPost)) {
				items[i].classList.remove(this.selectedPost);
				items[i-1].classList.add(this.selectedPost);
				break;
			}
		}
	},

	moveDown: function() {
		items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
		for(var i = 0; i < items.length-1; i++) {
			if(items[i].classList.contains(this.selectedPost)) {
				items[i].classList.remove(this.selectedPost);
				items[i+1].classList.add(this.selectedPost);
				break;
			}
		}
	},

	moveTop: function() {
		var items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
		for(var i = 0; i < items.length; i++) {
			items[i].classList.remove(this.selectedPost);
		}
		items[0].classList.add(this.selectedPost);
	},

	moveBottom: function() {
		var items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
		var i;
		for(i = 0; i < items.length; i++) {
			items[i].classList.remove(this.selectedPost);	
		}
		items[i-1].classList.add(this.selectedPost);
	},

	moveLeft: function() {
		if(this.curr==0) return;
		this.curr = (this.curr==0)?(this.panels.length-1):(this.curr-1);
		var items = document.getElementsByClassName(this.feedsClass);
		for(var i = 0; i< items.length; i++) {
			items[i].classList.remove(this.selectedFeed);
		}
		items[this.curr].classList.add(this.selectedFeed);
	},

	moveRight: function() {
		if(this.curr == 2) return;
		this.curr = (this.curr+1)%this.panels.length;
		var items = document.getElementsByClassName(this.feedsClass);
		for(var i = 0; i< items.length; i++) {
			items[i].classList.remove(this.selectedFeed);
		}
		items[this.curr].classList.add(this.selectedFeed);
	},

	moveLike: function() {
		if(this.curr == 1) {
			items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
			for(var i = 0; i < items.length; i++) {
				if(items[i].classList.contains(this.selectedPost)) {
					items[i].getElementsByTagName("facebook_text")[0].innerHTML += " <like class='operation'>Like</like>";
				}
			}
		}
	},

	moveComment: function() {
		if(this.curr == 1) {
			items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
			for(var i = 0; i < items.length; i++) {
				if(items[i].classList.contains(this.selectedPost)) {
					items[i].getElementsByTagName("facebook_text")[0].innerHTML += " <comment class='operation'>Comment</comment>";
				}
			}
		}
	},

	moveShare: function() {
		if(this.curr == 1) {
			items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
			for(var i = 0; i < items.length; i++) {
				if(items[i].classList.contains(this.selectedPost)) {
					items[i].getElementsByTagName("facebook_text")[0].innerHTML += " <share class='operation'>Share</share>";
				}
			}
		}
	},

	moveRetweet: function() {
		if(this.curr == 1) {
			items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
			for(var i = 0; i < items.length; i++) {
				if(items[i].classList.contains(this.selectedPost)) {
					items[i].getElementsByTagName("tweet_text")[0].innerHTML += " <retweet class='operation'>Retweeted</retweet>";
				}
			}
		}
	},

	moveStar: function() {
		if(this.curr == 1) {
			items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
			for(var i = 0; i < items.length; i++) {
				if(items[i].classList.contains(this.selectedPost)) {
					items[i].getElementsByTagName("tweet_text")[0].innerHTML += " <star class='operation'>Star</star>";
				}
			}
		}
	},

	moveReply: function() {
		if(this.curr == 1) {
			items = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr]);
			for(var i = 0; i < items.length; i++) {
				if(items[i].classList.contains(this.selectedPost)) {
					items[i].getElementsByTagName("tweet_text")[0].innerHTML += " <reply class='operation'>Reply</reply>";
				}
			}
		}
	},

	highlightFirst: function() {
		for(var i = 0; i < this.panels.length; i++) {
			console.log(i);
			var firstElement = document.getElementById(this.panels[i]).getElementsByTagName(this.posts[i])[0];
			console.log(firstElement);
		}
		var firstElement = document.getElementById(this.panels[this.curr]).getElementsByTagName(this.posts[this.curr])[0];
		firstElement.classList.add(this.selectedPost);
		document.getElementById(this.feeds[this.curr]).classList.add(this.selectedFeed);
	},

	scrollDown: function() {
	//	console.log("Scrolling Down");
		if(this.curr==1) {
			document.getElementById('twitter').scrollTop += 200;	
		}
		
	},

	scrollUp: function() {
	//	console.log("Scrolling Up");
		if(this.curr==1){
			document.getElementById('twitter').scrollTop -= 200;	
		}
		
	}

}

window.selector = selector;

/*
var highlight1 = {
	

	first: function(panelId, panelElement) {
		firstElement = document.getElementById(panelId).getElementsByTagName(panelElement)[0];
		console.log(firstElement);
		//firstElement.className += "selectedPost";
		console.log("Updated Class");
//		firstElement.style.backgroundColor = "red";
	},

	firstInView: function(panelId,panelElement) {
			
		element = document.getElementById(panelId);

		var rect = element.getBoundingClientRect();
		console.log(rect.top, rect.right, rect.bottom, rect.left);

//		console.log("*****************");
//		pE = pH.getElementsByTagName(panelElement);
//		for (ele in pE) {
//			console.log(ele.height);
//		}
		

	}
}
*/


$(document).ready(function() {

	setTimeout(function() {
		selector.highlightFirst();	
	}, 1000);

});
