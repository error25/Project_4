var morgan  = require('morgan');
var express = require('express');
var app     = express();
var bodyParser = require('body-parser');
var server  = require('http').createServer(app);
var io      = require('socket.io')(server);
var knox    = require('knox');
var fs = require('fs');
var fsPath = require('fs-path'); // makedirs with FS
var gm = require('gm');
////////////////// Routes Stuff
var cors = require('cors');
var router = require('./config/routes');
var config = require('./config/app');

var port    = process.env.PORT || 8000;
var imageStore = "https://s3-eu-west-1.amazonaws.com/betterside/";
var s3 = require('s3');

var mongoose = require('mongoose');
mongoose.connect(config.databaseUrl);

 
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});



app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: config.appUrl,
  credentials: true
}));


app.get('/', function(req, res) {
  res.render('index');
});


io.on('connect', function(socket) {
  console.log("User connected with socket id of: " + socket.conn.id);
  socket.on('message', function(message) {
    console.log(message.lastimage)
    saveBase64Local(message.lastimage, message.username);
    gifFramesEachLoop(message.username); // break gif frames to seperate files 
    io.emit('message', message);
  });
});

// save Base64 gif to file.
var saveBase64Local = function(imageBase64, username){
buf = new Buffer(imageBase64.replace(/^data:image\/\w+;base64,/, ""),'base64')
fs.writeFile('./public/uploads/' + username + '.gif', buf, function(err) {
  console.log(err);
   });
}
var gifFramesEachLoop = function(username) {
var i = 0;
  while (i < 5){
    writeGifFramesLocal('./public/uploads/' + username + ".gif[" + i + "]", i, username);
   i++  
 }
}
/////////Write Individual Image Frames
var writeGifFramesLocal = function(localgif, i, username){
gm(localgif)
.write('./public/uploads/' + username + i + '.png', function (err) {
  if (err) console.log('aaw, shucks' + err);
  frameSaved = './public/uploads/' + username + i + '.png';
  console.log("successfully saved locally :" + frameSaved );
  framesToAmazon(frameSaved, username);
  });
}
 /////////////////////////////////

var framesToAmazon = function(localfile, username){ 
  var params = {
    localFile: localfile,
   
    s3Params: {
      Bucket: "project4-wdi",
      Key: username + "/" + localfile,
    },
  };
  var uploader = client.uploadFile(params);
  uploader.on('error', function(err) {
    console.error("unable to upload:", err.stack);
  });
  uploader.on('progress', function() {
    console.log("progress", uploader.progressMd5Amount,
              uploader.progressAmount, uploader.progressTotal);
  });
  uploader.on('end', function() {
    console.log("done uploading");
  });

};

app.use('/scripts/gifshot', express.static(__dirname + '/node_modules/gifshot/build/'));

app.use('/', router);

server.listen(port, function() {
  console.log('Server started on ' + port);
});