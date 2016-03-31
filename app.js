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
    console.log(message.lastimage);


    //create knox AWS client.
    var AWSclient = knox.createClient({
      key: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET_KEY,
      bucket: config.AWS.bucket I HAVENT MADE THIS YET
    });

        var img = message.lastimage[0]; // just get the first (for the moment).
        var data = img.replace(/^data:image\/\w+;base64,/, "");
        var buf = new Buffer(data, 'base64');

        var re = AWSclient.put(message.username._id+'.png', {
          'Content-Length': buf.length,
          'Content-Type': 'img/png'
        });
        re.on('response', function(resp){
          if(200 == resp.statusCode) {
            console.log("Uploaded to" + re.url);
            pl.coverImg = re.url; //prepare to save image url in the database
            pl.save(function(error){
              if(error) console.log(error);
              else{

    io.emit('message', message);
  });
});

READ THIS BEFORE YOU CONTINUE TOMORROW ////////////// 
http://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js

YOU NEED TO GET THE ARRAY of BASE64 GIF files, and SAVE THOSE as GIFS on AMAZON S3.

Then you need to send each of those to the Google Cloud Vision Processor. 


////////////// Changed my mind

http://stackoverflow.com/questions/23620470/node-js-saving-canvas-as-an-image-for-heroku-hosted-apps-using-amazon-s3
app.use('/scripts/gifshot', express.static(__dirname + '/node_modules/gifshot/build/'));

server.listen(port, function() {
  console.log('Server started on ' + port);
});