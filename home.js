
window.addEventListener('DOMContentLoaded', function() {
	var v = document.getElementById('v');
	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
									navigator.mozGetUserMedia || navigator.msGetUserMedia);
	if(navigator.getUserMedia)
	{
		console.log('getUserMedia NOT null')
		navigator.getUserMedia(
			{
				video : true,
				audio : false
			},
			function(stream) 
			{
				var url = window.URL || window.webkitURL;
				v.src = url ? url.createObjectURL(stream) : stream;
				v.play();	
			},
			function(error)
			{
				console.log("Error", error);
			}
		);
	}
	else 
	{
		alert("Sorry! Browser doesn't support getUserMedia API");
	}

	var isStreaming = false,
    	v = document.getElementById('v'),
    	c = document.getElementById('c'),
    	cDot = document.getElementById('cDot'),
    	grey = document.getElementById('grey');
    	con = c.getContext('2d');
    	conDot = cDot.getContext('2d');
    	w = 300; 
    	h = 210;
    	greyscale = false;

    v.addEventListener('canplay', function(e) {
	   	if (!isStreaming) {
	    	// videoWidth isn't always set correctly in all browsers
	    	if (v.videoWidth > 0) h = v.videoHeight / (v.videoWidth / w);
	    	c.setAttribute('width', w);
	    	c.setAttribute('height', h);
	    	cDot.setAttribute('width', w);
	    	cDot.setAttribute('height', h);
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
      		if (greyscale) {
      			convertGray();
	      		img = new Image();
	      		img.src = c.toDataURL('image/png');
	      		conDot.drawImage(img,0,0);
	      		dotRemoval();
	      	}
   		}, 1000);
	}, false);

	grey.addEventListener('click', function() { greyscale = !greyscale; }, false);


	var convertGray = function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	// converting to gray scale
	   	for(var i = 0; i < data.length; i+=4) {
	   		var bright = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
	   		data[i] = bright;
	   		data[i + 1] = bright;
	   		data[i + 2] = bright;
	   	}
	   	//edge detection
	   	var threshold = 10
	   	for(var i = 0; i < data.length; i+=4) {
	   		top = i - imageData.width*4
	   		bottom = i + imageData.width*4
	   		//right
	   		if (Math.abs(data[i] - data[i+4]) > threshold) {
	   			data[i+1] = data[i+2]= 0;
	   			data[i] = 255; 
	   		}
	   		
	   		//top
	   		else if (Math.abs(data[i] - data[top]) > threshold) {
	   			data[i+1] = data[i+2]= 0;
	   			data[i] = 255; 
	   		}
	   		//bottom
	   		else if (Math.abs(data[i] - data[bottom]) > threshold) {
	   			data[i+1] = data[i+2]= 0;
	   			data[i] = 255; 
	   		}
	   		else {
	   			data[i] = data[i+1] = data[i+2]= 0;
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	} 

	// edge detection
	var goingGrey = function() {
		//console.log("goingGrey");
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	var threshold = 50;
	   	//console.log(imageData.width,"-", imageData.height);
	   	for(var i = 0; i < imageData.width; i++) {
	   		for(var j = 0; j < imageData.height; j++) {
	   			var curr = (i*imageData.height + j)*4;
	   			var top = (i*imageData.height + (j-1))*4;
	   			var bottom = (i*imageData.height + (j-1))*4;
	   			var left = ((i-1)*imageData.height + j)*4;
	   			var right = ((i+1)*imageData.height + j)*4;
	   			//imageData.data[curr] = 0;
	   			//imageData.data[curr] = imageData.data[curr+1] = imageData.data[curr+2] = 255;
	   			if( ((data[top]-data[curr]) > threshold) || ((data[bottom]-data[curr]) > threshold)
	   				 || ((data[left]-data[curr]) > threshold) || ((data[right]-data[curr]) > threshold) ) {
	   						imageData.data[curr] = imageData.data[curr+1] = imageData.data[curr+2] = 0;	
	   			}
	   		}
		}
	   con.putImageData(imageData, 0, 0);
	}

	var dotRemoval = function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	 
//	 	console.log(w,":",h,":",data.length);

	   	for(var i = 0; i < w; i++) {
	   		for(var j = 0; j < h; j++) {
	   			//console.log(i,"<->",j);
	   			var curr = (i*w + j)*4;
	   			var top = ((i-1)*w + j)*4;
	   			var bottom = ((i+1)*w + j)*4;
	   			var left = (i*w + (j-1))*4;
	   			var right = (i*w + (j+1))*4;
	   			if(typeof data[curr] == 'undefined') {
	   				console.log(i,"<-->",j);
	   			}
	   			//console.log("->",data[curr],":",top,":",bottom,":",right,":",left);
	   			//if(curr[data]==255) { 
	   			//	console.log(data[top] + data[bottom] + data[left] + data[right] ) 
	   			//}
	   		}
		}
	}

	var skinFilter1 = function() {
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
	}

	var skinFilter2 = function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		red = data[i]
	   		green = data[i+1]
	   		blue = data[i+2]
	   		data[i] = data[i+1] = data[i+2] =0;
	   		if( (red > 95) && (green > 40) && (blue > 20) ) {
	   			if( ( Math.max(red, green, blue) - Math.min(red, green, blue) ) > 15 ) {
	   				data[i+1] = 255;
	   			}
	   		}
	   		if( (red > 220) && (green > 210) && (blue > 170) ) {
	   			data[i+2] = 255;
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	}

	var skinFilter3 = function() {
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
	}

	var acceptDiff = function(rS,gS,bS,r,g,b,t) {
		if ( (Math.abs(rS- r) < t) && (Math.abs(gS- g) < t) && (Math.abs(bS- b) < t) ) {
			return true;
		}
		return false;
	}

	var validSkinTone = function(r,g,b) {
		var threshold = 10;
		if (acceptDiff(172,115,92,r,g,b,threshold) ) {return true};
		if (acceptDiff(95,52,47,r,g,b,threshold) )
			return true;
		if (acceptDiff(73,42,42,r,g,b,threshold))
			return true;
		if (acceptDiff(212,168,143,r,g,b,threshold) )
			return true;
		if (acceptDiff(148,95,70,r,g,b,threshold) )
			return true;
		if (acceptDiff(155,80,66,r,g,b,threshold) )
			return true;
		if (acceptDiff(238,204,192,r,g,b,threshold) )
			return true;
		if (acceptDiff(194,131,106,r,g,b,threshold) )
			return true;
		if (acceptDiff(153,109,92,r,g,b,threshold) )
			return true;
		return false;
	}

	var skinFilter4 = function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		red = data[i];
	   		green = data[i+1];
	   		blue = data[i+2];
	   		data[i] = data[i+1] = data[i+2] =0;
	   		if (validSkinTone(red, green, blue) ){
	   			data[i+2] = 255; 
	   		}
	   	}
	   	con.putImageData(imageData, 0, 0);
	}

	//YCbCr color scheme approach
	var skinFilter5 = function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		red = data[i];
	   		green = data[i+1];
	   		blue = data[i+2];
	   		data[i] = data[i+1] = data[i+2] =255;
	   		Y = 0.299*red + 0.587*green + 0.114*blue;
	   		/*Cb = 128 - 0.168736*red - 0.331264*green + 0.5*blue;
	   		Cr = 128 + 0.5*red - 0.418688*green - 0.081312*blue;
	   		*/
	   		Cb = blue - Y;
	   		Cr = red - Y;
	   		if(Cb < 127 && Cb > 77 && Cr < 173 && Cr > 133) {
	   			data[i] = 0;
	   		}

	   	}
	   	con.putImageData(imageData, 0, 0);
	}

	//HSV approach
	var skinFilter6 = function() {
		var imageData = con.getImageData(0, 0, w, h);
	   	var data = imageData.data;
	   	for(var i = 0; i < data.length; i+=4) {
	   		red = data[i]/255;
	   		green = data[i+1]/255;
	   		blue = data[i+2]/255;
	   		data[i] = data[i+1] = data[i+2] =0;
	   		Cmax = Math.max(red, green, blue);
	   		Cmin = Math.min(red, green, blue);
	   		del = Cmax - Cmin;
	   		var H;
	   		if(Cmax == 0) {
	   			H = 0;
	   		}
	   		else if(Cmax == red) {
	   			H = ((green-blue)/del) % 6;
	   		}
	   		else if(Cmax == green) {
	   			H = ((blue - red)/del) + 2;
	   		}
	   		else{
	   			H = ((red-green)/del) + 4;
	   		}
	   		H = 60 * H;
	   		var S;
	   		if (Cmax == 0) {
	   			S = 0;
	   		}
	   		else{
	   			S = del/Cmax;
	   		}
	   		if(H>=0 && H<=50 && S>=0.1 && S<=0.9){
	   			data[i] = 255;
	   		}

	   	}
	   	con.putImageData(imageData, 0, 0);
	}
	
});


