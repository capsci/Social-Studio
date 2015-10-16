$(document).ready(function() {

	console.log("gesturesDemo.js");

	var videoFeed = document.getElementById("videoFeed");
	var hsvCanvas = document.getElementById("canvasHSVfilter");

	var streaming = false;
	var videoStream = null;
	var frameRate = 100;

	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia || navigator.msGetUserMedia);

	if(navigator.getUserMedia == null) {
		alert("GetUserMedia API not supported");
	}

	// Browser supports GetUserMedia API

	$(videoFeedButton).click(function() {
		if(streaming) {

			$(this).css("background-color", "#FF5555");
			streaming = false;
			
			videoFeed.pause();
			videoStream.stop();

		}
		else {

			$(this).css("background-color", "#55FF55");
			streaming = true;

			navigator.getUserMedia( {
					video : true,
					audio : true
				},

				function(stream) {
					videoStream = stream;
					var url = window.URL || window.webkitURL;
					videoFeed.src = url ? url.createObjectURL(stream) : stream;
					videoFeed.play();	

				},

				function(error) {
					alert("Error in fetching camera device");
					console.log("Error", error);
				}
			);

		}
	});

/*	videoFeed.addEventListener('canplay', function(e) {
   		if (streaming) {
    		if (videoFeed.videoWidth > 0) h = videoFeed.videoHeight / (videoFeed.videoWidth / w);
    		binaryCanvas.setAttribute('width', w);
    		binaryCanvas.setAttribute('height', h);
    		
    		//cDot.setAttribute('width', w);
    		//cDot.setAttribute('height', h);
	    	// Reverse the canvas image
	    	//con.translate(w, 0);
	    	//con.scale(-1, 1);
	    	
	    //	isStreaming = true;
	   }
	}, false);
*/
	videoFeed.addEventListener('play', function() {
		
		setInterval(function() {
  			if (videoFeed.paused || videoFeed.ended) return;

  			if(preprocessing.previousFrame != null) {
  			//	console.log(preprocessing.previousFrame);
  			}
			
		//	preprocessing.convertToGray(binaryCanvas);

		//	preprocessing.skinFilter.RGBapproachCalc(rgbCanvasCalc);

		//	preprocessing.skinFilter.RGBapproach(rgbCanvas, "bright");

			preprocessing.skinFilter.HSVapproach(hsvCanvas);

			//preprocessing.healing(hsvCanvas, hsvCanvas);

			//preprocessing.erosion(healingCanvas);

			//gestures.centerOfMass(healingCanvas);

			//gestures.movedCoM(healingCanvas);

//			gestures.medianCoM(healingCanvas);

			gestures.manipMedianCom(hsvCanvas);

			preprocessing.saveFrameData(hsvCanvas);

//			console.log("-");


		}, frameRate);
	}, false);
/*
	$(grayScale).click(function() {
		binarize ? $(this).css("background-color","#FF5555") : $(this).css("background-color","#55FF55");
		binarize = binarize ? false : true; 
	});

	$(skinFilterRGBCalc).click(function() {
		rgbSkinFilterCalc ? $(this).css("background-color","#FF5555") : $(this).css("background-color","#55FF55");
		rgbSkinFilterCalc = rgbSkinFilterCalc ? false : true; 
	});

	$(skinFilterRGB).click(function() {
		rgbSkinFilter ? $(this).css("background-color","#FF5555") : $(this).css("background-color","#55FF55");
		rgbSkinFilter = rgbSkinFilter ? false : true; 
	});

	$(skinFilterHSV).click(function() {
		hsvSkinFilter ? $(this).css("background-color","#FF5555") : $(this).css("background-color","#55FF55");
		hsvSkinFilter = hsvSkinFilter ? false : true; 
	});

	$(frameHeal).click(function() {
		heal ? $(this).css("background-color","#FF5555") : $(this).css("background-color","#55FF55");
		heal = heal ? false : true; 
	});
*/
});



//var binarize = false;
//var rgbSkinFilterCalc = false;
//var rgbSkinFilter = false;
var hsvSkinFilter = true;
//var heal = false;
//var healWindow = 50;

var w = 300;	//width and height of video frame 
var h = 210;

var preprocessing = {

	previousFrame: null,

	convertToGray: function(canvas) {

		if(binarize) {

			canvas.setAttribute("width", w);
			canvas.setAttribute("height", h);
			var con = canvas.getContext("2d");
			con.fillRect(0, 0, w, h);
			con.drawImage(videoFeed, 0, 0, w, h);

			var imageData = con.getImageData(0, 0, w, h);
			var data = imageData.data;
			
			for(var i = 0; i < data.length; i+=4) {
				var bright = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
				data[i] = bright;
				data[i + 1] = bright;
				data[i + 2] = bright;
			}

			con.putImageData(imageData, 0, 0);
			
		}
	},

	skinFilter: {

		RGBapproachCalc: function(canvas) {
			
			if(rgbSkinFilterCalc) {

				canvas.setAttribute("width", w);
				canvas.setAttribute("height", h);
				var con = canvas.getContext("2d");
				con.fillRect(0, 0, w, h);
				con.drawImage(videoFeed, 0, 0, w, h);

				var imageData = con.getImageData(0, 0, w, h);
				var data = imageData.data;
				
				

				for(var i = 0; i < data.length; i+=4) {

					red = data[i]
					green = data[i+1]
					blue = data[i+2]
					data[i] = data[i+1] = data[i+2] =0;
					
					if( (red >= 73) && (red <= 240) && (green >= 50) && (green <= 200) && (blue >= 40) && (blue <= 140) ) {
						data[i] = data[i+1] = data[i+2] = 255;	
					}

				}

				con.putImageData(imageData, 0, 0);

			}
		},

		RGBapproach: function(canvas, lightning) {
			
			if(rgbSkinFilter) {

				canvas.setAttribute("width", w);
				canvas.setAttribute("height", h);
				var con = canvas.getContext("2d");
				con.fillRect(0, 0, w, h);
				con.drawImage(videoFeed, 0, 0, w, h);

				var imageData = con.getImageData(0, 0, w, h);
				var data = imageData.data;
				
				

				for(var i = 0; i < data.length; i+=4) {

					red = data[i]
					green = data[i+1]
					blue = data[i+2]
					data[i] = data[i+1] = data[i+2] =0;
					
					if( ((0.836*green -14) < blue) && (blue < (0.836*green + 44)) ) {
						data[i] = data[i+1] = data[i+2] = 255;
					}

					else if( ((0.79*green -67) < blue) && (blue < (0.78*green + 42)) ) {
						data[i] = data[i+1] = data[i+2] = 255;
					}

				}

				con.putImageData(imageData, 0, 0);

			}
		},

		HSVapproach: function(canvas) {

			if(hsvSkinFilter) {

				canvas.setAttribute("width", w);
				canvas.setAttribute("height", h);
				var con = canvas.getContext("2d");
				//con.translate(w, 0);
				//con.scale(-1, 1);
				con.fillRect(0, 0, w, h);
				con.drawImage(videoFeed, 0, 0, w, h);

				var imageData = con.getImageData(0, 0, w, h);
				var data = imageData.data;

				for(var i = 0; i < data.length; i+=4) {

					red = data[i]
					green = data[i+1]
					blue = data[i+2]

					data[i] = data[i+1] = data[i+2] =0;
			
					var hsv = utilities.rgb2hsv(red, green, blue);

					if (hsv[0] < 50 && hsv[1] < 0.68 && hsv[1] > 0.23) {
						data[i] = data[i+1] = data[i+2] = 255;
					}
				}	

				con.putImageData(imageData, 0, 0);

			}
		}

	},

	healing: function(canvas, reference) {

		if(hsvSkinFilter) {

			canvas.setAttribute("width", w);
			canvas.setAttribute("height", h);
			var con = canvas.getContext("2d");
			con.fillRect(0, 0, w, h);
			con.drawImage(reference, 0, 0, w, h);

			var imageData = con.getImageData(0, 0, w, h);
			var data = imageData.data;

			for(var i = 0; i < w; i++) {
				for(var j = 0; j < h; j++) {

					var idx = (i*h + j) * 4;
					var top = (i*h + (j-1)) * 4;
					var bottom = (i*h + (j+1)) * 4;
					var left = ((i-1)*h + j) * 4;
					var right = ((i+1)*h + j) * 4;

					//dot removal
					if( data[idx] == 255 && (data[top] + data[bottom] + data[left] + data[right] <= 100) ) {
						data[idx] = data[idx+1] = data[idx+2] = 0;
					}

					//erosion
					/*
					if( (data[idx] == 0) && (data[top] + data[bottom] + data[left] + data[right] >= 765) ) {
						data[idx] = data[idx+1] = data[idx+2] = 255;
					}
					*/

				}
			}

			con.putImageData(imageData, 0, 0);
		}
	},

	erosion: function(canvas) {

		if(heal) {
			var con = canvas.getContext("2d");
			var imageData = con.getImageData(0, 0, w, h);
			var data = imageData.data;

			for(var i = 0; i < w - healWindow; i++) {
				for(var j = 0; j < h - healWindow; j++) {
					data = utilities.fillWindow(data, i, j);
				}
			}

			con.putImageData(imageData, 0, 0);
		}
	},

	saveFrameData: function(canvas) {
		var con = canvas.getContext("2d");
		var imageData = con.getImageData(0, 0, w, h);
		this.previousFrame = imageData.data;
	}

}

var movement = {

	duration: 10,
	prevX : 0,
	prevY : 0,
	threshold_X : 10,
	threshold_Y : 10,
	history: Array(this.duration),
	countdown: -1,

	addTransition: function(newX, newY) {
		var historyItem = "NoMovement";
		var delX = newX - this.prevX;
		var delY = newY - this.prevY;

//		console.log(delX,"<->",delY);
		
		if(Math.abs(delY) > this.threshold_Y) {
			//console.log(delY);
			if(delY < 0) {
		//		console.log("Right");
				historyItem = "Right";
			}
			else {
		//		console.log("Left");
				historyItem = "Left";
			}
		}

		if(Math.abs(delX) > this.threshold_X) {
			//console.log(delX);
			if(delX < 0) {
		//		console.log("Up");
				historyItem = "Up";
			}
			else {
		//		console.log("Down");
				historyItem = "Down";
			}
		}

		this.prevX = newX;
		this.prevY = newY;

		this.saveHistory(historyItem);
	},

	addMovement: function(newX, newY) {
		var historyItem = "NoMovement";
		var delX = newX - this.prevX;
		var delY = newY - this.prevY;


		if(Math.abs(delX) > this.threshold_X) {
			if(delX > 0) {
			//	console.log("Right");
				historyItem = "Right";
			}
			else {
			//	console.log("Left");
				historyItem = "Left";
			}
		}
		this.prevX = newX;
		this.prevY = newY;

		this.saveHistory(historyItem);
	},

	saveHistory: function(historyItem) {

		for(var i = 0; i < this.duration - 1; i++) {
			this.history[i] = this.history[i+1];
		}
		this.history[this.duration-1]= historyItem;

		//console.log(this.history);


		if (this.countdown > 0) {
			this.countdown = this.countdown - 1;
			return;
		}
		
		var leftMovement = this.history.filter(function(x){return x=="Left"}).length;
		var rightMovement = this.history.filter(function(x){return x=="Right"}).length;
		var upMovement = this.history.filter(function(x){return x=="Up"}).length;
		var downMovement = this.history.filter(function(x){return x=="Down"}).length;
		//console.log(leftMovement,":", rightMovement);
		if(leftMovement >= 4) {
			this.countdown = this.duration;
			document.getElementById("movement").innerHTML = "LEFT";
			console.log("Left******");
			selector.moveLeft();
		}
		else if(rightMovement >= 4) {
			this.countdown = this.duration + 10;
			document.getElementById("movement").innerHTML = "RIGHT";
			console.log("Right*****");
			selector.moveRight();
		}
		else if(upMovement >= 4) {
			this.countdown = this.duration + 10;
			document.getElementById("movement").innerHTML = "UP";
			console.log("Up*****");
			selector.scrollUp();
		}
		else if(downMovement >= 4) {
			this.countdown = this.duration + 10;
			document.getElementById("movement").innerHTML = "DOWN";
			console.log("Down*****");
			selector.scrollDown();
		}
		
		console.log("-");


	}

}

var gestures = {

	movementThreshold: 5000,

	manipMedianCom: function(canvas) {
		if(!hsvSkinFilter) return;

		var con = canvas.getContext("2d");
		var imageData = con.getImageData(0, 0, w, h);
		var data = imageData.data;

		var cI = [];
		var cJ = [];
		var count = 0;

		for(var i = 20; i < h-20; i++) {
			for(var j = 20; j < w-20; j++) {
				var idx = (i*w + j)*4;
				if(data[idx] == 255) {
					cJ[count] = j;
					count = count + 1;
				}
			//	data[idx] = data[idx+1] = data[idx+2] = 0;
			}
		}
		cJ.sort();
		cJ = (count%2==0)?(cJ[count/2]):(cJ[(count+1)/2]);

		count = 0;
		for(var i = 20; i < w-20; i++) {
			for(var j = 20; j < h-20; j++) {
				var idx = (i*h + j)*4;
				if(data[idx] == 255) {
					cI[count] = i;
					count = count + 1;
				}
			//	data[idx] = data[idx+1] = data[idx+2] = 0;
			}
		}
		cI.sort();
		cI = (count%2==0)?(cI[count/2]):(cI[(count+1)/2]);

		//console.log(cJ,"<->",cI);
		movement.addTransition(cI,cJ);

	},

	medianCoM: function(canvas) {
		if (!heal) return;

		var con = canvas.getContext("2d");
		var imageData = con.getImageData(0, 0, w, h);
		var data = imageData.data;

		var cI = [];
		var cJ = [];
		var count = 0;

		for(var i = 20; i < h -20; i++) {
			for(var j = 20; j < w -20; j++) {
				var idx = (i*w + j)*4;
				if(data[idx] == 255) {
					cI[count] = i;
					cJ[count] = j;
					count = count + 1;
				}
			//	data[idx] = data[idx+1] = data[idx+2] = 0;
			}
		}
		cI.sort();
		cJ.sort();
		var mIdx = (count%2==0)?(count/2):((count+1)/2);
		console.log(cI[mIdx],":",cJ[mIdx]);


		movement.addTransition(cI[mIdx], cJ[mIdx]);

	},

	movedCoM: function(canvas) {
		if (!heal) return;

		var con = canvas.getContext("2d");
		var imageData = con.getImageData(0, 0, w, h);
		var data = imageData.data;

		var cI = 0;
		var cJ = 0;
		var count = 0;

		for(var i = 0; i < w; i++) {
			for(var j = 0; j < h; j++) {
				idx = (i*h + j)*4;
				if(data[idx] != preprocessing.previousFrame[idx] ) {
					cI = cI + i;
					cJ = cJ + j;
					count = count + 1;
				}
				data[idx] = data[idx+1] = data[idx+2] = 0;
			}
		}

		if(count > this.movementThreshold) {
			movement.addMovement(cI, cJ);
//			console.log("(",cI,":",cJ,")->",count);	
		}
		else {
			movement.addMovement(0,0);
		}
		
	},

	centerOfMass: function(canvas) {

		if(!heal) return;

		var con = canvas.getContext("2d");
		var imageData = con.getImageData(0, 0, w, h);
		var data = imageData.data;

		for(var i = 0; i < w; i++) {
			for(var j = 0; j < h; j++) {
				idx = (i*h + j)*4;
				if(data[idx] == 255) {
					cI = cI + i;
					cJ = cJ + j;
					count = count + 1;
				}
				data[idx] = data[idx+1] = data[idx+2] = 0;
			}
		}

		var cI = 0;
		var cJ = 0;
		var count = 0;

		for(var i = 0; i < w; i++) {
			for(var j = 0; j < h; j++) {
				idx = (i*h + j)*4;
				if(data[idx] == 255) {
					cI = cI + i;
					cJ = cJ + j;
					count = count + 1;
				}
				data[idx] = data[idx+1] = data[idx+2] = 0;
			}
		}

	//	cI = Math.round(cI/count);
	//	cJ = Math.round(cJ/count);
		
//		var cIdx;
/*
		cIdx = (cJ*h + cI)*4;
		data[cIdx+1] = data[cIdx+2] = 255;
		data[cIdx+5] = data[cIdx+6] = 255;
		data[cIdx+9] = data[cIdx+10] = 255;
		data[cIdx+13] = data[cIdx+14] = 255;
*/
		console.log(cI,":",cJ,"->",count);

/*		cI = 60;
		cIdx = (cJ*h + cI)*4;

		data[cIdx+1] = data[cIdx+2] = 150;
		data[cIdx+5] = data[cIdx+6] = 150;
		data[cIdx+9] = data[cIdx+10] = 150;
		data[cIdx+13] = data[cIdx+14] = 150;
*/
		con.putImageData(imageData, 0, 0);

	}

}

/*
window.addEventListener('DOMContentLoaded', function() {
	var v = document.getElementById('v');
	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia || navigator.msGetUserMedia);
	if(navigator.getUserMedia) {
		console.log('getUserMedia NOT null')
		navigator.getUserMedia( {
				video : true,
				audio : false
			},
			function(stream) {
				var url = window.URL || window.webkitURL;
				v.src = url ? url.createObjectURL(stream) : stream;
				v.play();	
			},
			function(error) {
				console.log("Error", error);
			}
		);
	}
	else {
		alert("Sorry! Browser doesn't support getUserMedia API");
	}
*/
/*
	var isStreaming = false,
	v = document.getElementById('v'),
	c = document.getElementById('c'),
	
	//cDot = document.getElementById('cDot'),
	grey = document.getElementById('grey');
	con = c.getContext('2d');
	
	//conDot = cDot.getContext('2d');
	greyscale = false;

	v.addEventListener('canplay', function(e) {
   		if (!isStreaming) {
    	// videoWidth isn't always set correctly in all browsers
    		if (v.videoWidth > 0) h = v.videoHeight / (v.videoWidth / w);
    		c.setAttribute('width', w);
    		c.setAttribute('height', h);
    		
    		//cDot.setAttribute('width', w);
    		//cDot.setAttribute('height', h);
	    	// Reverse the canvas image
	    	con.translate(w, 0);
	    	con.scale(-1, 1);
	    	
	    	isStreaming = true;
	   }
	}, false);

	v.addEventListener('play', function() {
		// Every 33 milliseconds copy the video image to the canvas
		setInterval(function() {
  			if (v.paused || v.ended) return;
			con.fillRect(0, 0, w, h);
  			con.drawImage(v, 0, 0, w, h);
			
  			//savedFrame = con.getImageData(0, 0, w, h);
			

  			//gestures.loadPrevFrame();
  			//conb.putImageData(savedFrame, 0, 0);
			//goingGrey();
//			filterSkin.grayScale();
//			filterSkin.settings2();// normal/bright
			//filterSkin.settings4();
			preprocessing.fillers();
			gestures.frameCentreOfMass();
			//preprocessing.dotRemoval()
			//filterSkin.fillers();

  			img = new Image();
  			img.src = c.toDataURL('image/png');
  			//conDot.drawImage(img,0,0);
  			//dotRemoval();

  			//gestures.printFrameData();

  			console.log("!!!!!!!!!!!!");


  			//gestures.saveFrameData();
  			//gestures.printFrameData();
  			console.log("**************");
  			

		}, frameRate);
	}, false);
});
*/

var filterSkin = {
	grayScale: function() {
	   	var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		var bright = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
	   		data[i] = bright;
	   		data[i + 1] = bright;
	   		data[i + 2] = bright;
	   	}
	   	con.putImageData(imageData, 0, 0);
	},

	// not working
	settings1: function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		red = data[i]
	   		green = data[i+1]
	   		blue = data[i+2]
	   		if( (red < 249 && red > 235) && (green < 202 && green > 180) && (blue < 194 && blue > 173) ) {

	   		}
	   		else {
	   			data[i] = data[i+1] = data[i+2] = 0;
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	},

	settings2 : function(lightning) {
		lightning = lightning || 'normal'
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		red = data[i]
	   		green = data[i+1]
	   		blue = data[i+2]
	   		data[i] = data[i+1] = data[i+2] =0;
	   		if( (lightning == 'normal') && (red > 95) && (green > 40) && (blue > 20) ) {
	   			if( ( Math.max(red, green, blue) - Math.min(red, green, blue) ) > 15 ) {
	   				data[i+1] = 255;
	   			}
	   		}
	   		if( (lightning == 'bright') && (red > 220) && (green > 210) && (blue > 170) ) {
	   			data[i+2] = 255;
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	},

	settings3 : function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		red = data[i]
	   		green = data[i+1]
	   		blue = data[i+2]
	   		data[i] = data[i+1] = data[i+2] =0;
	   		if( ((0.836*green -14) < blue) && (blue < (0.836*green + 44)) ) {
	   			data[i] = 255;
	   		}
	   		else if( ((0.79*green -67) < blue) && (blue < (0.78*green + 42)) ) {
	   			data[i] = 255;
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	},

	//based on HSV calculation
	settings4 : function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		red = data[i]
	   		green = data[i+1]
	   		blue = data[i+2]
	   		data[i] = data[i+1] = data[i+2] =0;
	   		
	   		var hsv = utilities.rgb2hsv(red, green, blue);

	   		if (hsv[0] < 50 && hsv[1] < 0.68 && hsv[1] > 0.23) {
	   			data[i] = 255;
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	},

	fillers: function() {
		//console.log("Fillers<",w,":",h);
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < w; i++) {
	   		for(var j = 0; j < h; j++) {
	   			idx = (i*h +j) * 4;
	   			//console.log(idx);
	   			red = data[idx];
	   			green = data[idx + 1];
	   			blue = data[idx + 2];
	   			data[idx] = data[idx+1] = data[idx+2] =0;
	   		
	   			data
	   			var hsv = utilities.rgb2hsv(red, green, blue);

		   		if (hsv[0] < 50 && hsv[1] < 0.68 && hsv[1] > 0.23) {
		   			data[idx] = 255;
		   			data[idx+1] = 255;
		   			data[idx+2] = 255;
	   			}
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	}

}

var preprocessing1 = {
	fillers: function() {
		//console.log("Fillers",w,":",h);
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < w; i++) {
	   		for(var j = 0; j < h; j++) {
	   			idx = (i*h +j) * 4;
	   			red = data[idx];
	   			green = data[idx + 1];
	   			blue = data[idx + 2];
	   			data[idx] = data[idx+1] = data[idx+2] =0;
	   		
	   			var hsv = utilities.rgb2hsv(red, green, blue);

		   		if (hsv[0] < 50 && hsv[1] < 0.68 && hsv[1] > 0.23) {
		   			data[idx] = 255;
		   			data[idx+1] = 255;
		   			data[idx+2] = 255;
	   			}
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	},
	dotRemoval: function() {
		//console.log("dotRemoval");
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	//console.log(w,":",h);
	   	for(var i = 0; i < w; i++) {
	   		for(var j = 0; j < h; j++) {
	   			var idx = (i*w +j) * 4;
	   			var topPix = ((i-1)*w +j) * 4;
	   			var bottomPix = ((i+1)*w +j) * 4;
	   			var leftPix = (i*w +(j-1)) * 4;
	   			var rightPix = (i*w +(j+1)) * 4;
	   			//console.log(topPix);
	   			if(data[idx] == 255) {
	   				//console.log("<",data[bottomPix+1]);
	   				if( data[topPix] + data[bottomPix] + data[leftPix] + data[rightPix] <= 300) {
	   					data[idx] = 0;
	   					//console.log("Removed");
	   				}
	   			}
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	}
}

var gestures1 = {

	frameCentreOfMass: function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	var cI = 0;
	   	var cJ = 0;
	   	var count = 0;
	   	for(var i = 0; i < w; i++) {
	   		for(var j = 0; j < h; j++) {
	   			var idx = (i*h +j) * 4;
	   		//	console.log(prevFrameData[i][j]);
	   			if(data[idx] == 255) {// && prevFrameData[i][j] != 255) {
	   				cI = cI + i;
	   				cJ = cJ + j;
	   				count = count + 1;

	   				data[idx] = data[idx+1] = data[idx+2] = 0;
	   			}
	   			
	   		}
	   	}

	   	cI = cI/count;
	   	cJ = cJ/count;

	   	if(count >= 900) {
	   		console.log("(",cI,",",cJ,") -> ",count);
	   	}
	   	


	   	idxC = (cI*w + cJ) * 4;
	   	idxV = (cI*h + cJ) * 4;

	   	idxC = Math.floor(idxC);
	   	idxV = Math.floor(idxV);

	   	console.log("Paint:",idxC,"<->",idxV);

	   	//data[idxC + 1] = data[idxC + 2] = 0;
	   	data[idxC] = 255;
	   	data[idxC+4] = 255;
	   	data[idxC+8] = 255;
	   	data[idxC+12] = 255;
	   	data[idxC+16] = 255;
	   	data[idxC+20] = 255;
	   	data[idxC+24] = 255;
	   	data[idxC+28] = 255;
	   	data[idxC+32] = 255;
	   	data[idxC+36] = 255;
	   	data[idxC+40] = 255;
	   	data[idxC+44] = 255;
	   	data[idxC+48] = 255;

	   	data[idxV] = 255;
	   	data[idxV+4] = 255;
	   	data[idxV+8] = 255;
	   	data[idxV+12] = 255;
	   	data[idxV+16] = 255;
	   	data[idxV+20] = 255;
	   	data[idxV+24] = 255;
	   	data[idxV+28] = 255;
	   	data[idxV+32] = 255;
	   	data[idxV+36] = 255;
	   	data[idxV+40] = 255;
	   	data[idxV+44] = 255;
	   	data[idxV+48] = 255;

	   	con.putImageData(imageData, 0, 0);
	   	
	},

	saveFrameData: function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < w; i++) {
	   		for(var j = 0; j < h; j++) {
	   			var idx = (i*h +j) * 4;

	   			//console.log(prevFrameData[i][j]);

	   			prevFrameData[i][j] = data[idx];
	   		//	console.log("<<>>",prevFrameData[i][j]);
	   		//	console.log(data[idx]);
	   		}
	   	}
//	   	console.log(prevFrameData);
		for(var i = 0; i < w; i++) {
	   		for(var j = 0; j < h; j++) {
	   		//	console.log("<<>>",prevFrameData[i][j]);
	   		}
	   	}
		
	},

	printFrameData: function() {
		for(var i = 0; i < w; i++) {
	   		for(var j = 0; j < h; j++) {
	   			console.log("<<",prevFrameData[i][j]);
	   		}
	   	}
	}
}

var utilities = {

	rgb2hsv: function(r,g,b) {

		r = r/255;
		g = g/255;
		b = b/255;

		var H;
		var S
		var V;

		min = Math.min(r, g, b);
		max = Math.max(r, g, b);
		del = max - min;

		V = max;
		
		if(del == 0) {
			H = 0;
		}
		else if(max == r) {
			H = 60 * ( ( (g - b)/del ) % 6 );
		}
		else if(max == g) {
			H = 60 * ( ( (g - r)/del ) + 2 );
		}
		else {
			H = 60 * ( ( (r - g)/del ) + 4 );
		}

		if(max == 0) {
			S = 0;
		}
		else {
			S = del/max;
		}

		return [H,S,V]

	},

	fillWindow: function(frameData, startX, startY) {

		var count = 0;

		for(var i = startX; i < startX + healWindow; i++) {
			for(var j = startY; j < startX + healWindow; j++) {
				var idx = (i*h + j)*4;
				if(frameData[idx] == 255) {
					count = count + 1;
				}
			}
		}

		if (count/(healWindow * healWindow) >= 0.5) {
			for(var i = startX; i < startX + healWindow; i++) {
				for(var j = startY; j < startX + healWindow; j++) {
					//console.log("Yes");
					var idx = (i*h + j)*4;
					frameData[idx] == 255;
					frameData[idx+1] == 255;
					frameData[idx+2] == 255;

				}
			}
		}

		return frameData;
	}

}