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

server.listen(port, function() {
  console.log('Server started on ' + port);
});