var http = require('http');
var fs = require('fs');
var index = fs.readFileSync("home.html");
var portNo = 8000;

console.log("Listening on localhost:" + portNo);

http.createServer(function(req, res) {
//	var message = "Webpage using NodeJS";
	console.log("Connection Requested..");
	res.writeHead(200, {'Content-Type' : 'text/html'});
	res.write(index);	
	res.end();
}).listen(portNo);