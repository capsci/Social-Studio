//NodeServer
i = 0
//audio
var recognition = new webkitSpeechRecognition();
			// default browser continuous setting is false. exits after line break
	recognition.continuous = true;
	recognition.onresult = function(event) { 
		console.log(event)
  		console.log(event.results[i][0].transcript);
  		console.log(event.results[i][0].confidence); 
  		audioEle = document.getElementById("audio");
  		audioEle.innerHTML = event.results[i][0].transcript;
  		if(event.results[i][0].transcript = "new tab") {
  			newURL = "https://www.google.com";
		//	window.open(newURL,'_blank');
			//x.focus();
			console.log("Opening")
  		}
  		event.results[i][0].transcript = "updated";
  		i = i + 1;
	}
recognition.start();


/*
var su = new SpeechSynthesisUtterance();
var voices = window.speechSynthesis.getVoices();
su.voice = voices[50];
su.lang = "en";
su.text = "Hello World! How are you doing today? Yabba Dabba Doo";
//speechSynthesis.speak(su);
*/
//video
/*
var v = document.getElementById('v');
navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
								navigator.mozGetUserMedia || navigator.msGetUserMedia);
if(navigator.getUserMedia)
{
	console.log('getUserMedia NOT null')
	navigator.getUserMedia(
		{
			video : true,
			audio : true
		},
		function(stream) 
		{
			console.log("Stream");
			var url = window.URL || window.webkitURL;
			v.src = url ? url.createObjectURL(stream) : stream;
			v.play();	
		},
		function(error) 
		{
			console.log("Error");
		}
	);
}
else 
{
	alert("Sorry! Browser doesn't support getUserMedia API");
}
*/