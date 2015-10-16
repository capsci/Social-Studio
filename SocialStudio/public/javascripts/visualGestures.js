// Visual Gestures
var readCam = false;
var frameRate = 1000;

var con; //context of image
var w = 300;	//width and height of video frame 
var h = 210;

//w = 30;
//h = 21;

var prevFrameData = new Array(w);
for(var i = 0; i < w; i++) {
	prevFrameData[i] = new Array(h);
}

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

var preprocessing = {
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

var gestures = {

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

}