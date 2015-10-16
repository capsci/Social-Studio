var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//Global variables
var twitter = require('ntwitter');;
var twit;
var stream;

function connect_twitter() {

  //connect to twitter
  console.log('Connecting to twitter with given credentials')
  
  //fill keys obtained from https://apps.twitter.com/app
  /*** Enter the twitter credentials ***/
  twit = new twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_SECRET
  });

  twit
    .verifyCredentials(function (err, data) {
      console.log(data);
    })
    .updateStatus('Test tweet from ntwitter/' + twitter.VERSION,
      function (err, data) {
        console.log(data);
      }
   );

}

function fetch_tweets(socket) {

  var tweetCount = 30;
  console.log('Fetching tweets');

  twit.stream('statuses/filter',{track:['love','hate']}, function(stream) {
    
    stream.on('data', function(data) {
      if (tweetCount > 0) {
        socket.emit('tweet',{tweet:data});
      //  console.log("TWEET.TEXT",data.text);
        tweetCount = tweetCount - 1;
      }
      if(tweetCount < 0) {
        console.log("Removed Listener");
        stream.removeAllListeners('data');
      }

    });
  });
}



//bind server to a host and port
var server = require('http').createServer(app);
var port = 3000;
server.listen(port);
console.log("Server listening on http://127.0.0.1:" + port + "/SocialStudio");

//create a socket
var sio = require('socket.io').listen(server);
sio.sockets.on('connection',function(socket) {

  console.log('Web client connected');

  connect_twitter();
  fetch_tweets(socket);


  socket.on('disconnect',function() {
    console.log('Web client disconnected');

  });

});



module.exports = app;
