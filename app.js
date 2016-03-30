var morgan  = require('morgan');
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var port    = process.env.PORT || 8000;

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'));

app.use(morgan('dev'));

app.get('/', function(req, res) {
  res.render('index');
});

io.on('connect', function(socket) {
  console.log("User connected with socket id of: " + socket.conn.id);
  socket.on('message', function(message) {
    console.log(message);
    io.emit('message', message);
  });
});

READ THIS BEFORE YOU CONTINUE TOMORROW ////////////// 
http://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js

YOU NEED TO GET THE ARRAY of BASE64 GIF files, and SAVE THOSE as GIFS on AMAZON S3.

Then you need to send each of those to the Google Cloud Vision Processor. 

app.use('/scripts/gifshot', express.static(__dirname + '/node_modules/gifshot/build/'));

server.listen(port, function() {
  console.log('Server started on ' + port);
});