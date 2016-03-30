
angular.module('VinceLynch')
.controller('webcamController', webcamController);


webcamController.$inject = ['$window', '$scope'];
function webcamController($window, $scope) {


  var socket = $window.io();

  var self = this;
  self.messages = [];

  self.message = null;
  self.username = "";
  self.hasSetUsername = false;
  self.lastImage = "";

  self.setUsername = function() {
    if(self.username.length > 2) self.hasSetUsername = true;
  }

  socket.on('message', function(message) {
    $scope.$applyAsync(function() {
      self.messages.push(message);
    });
  });

  self.sendMessage = function() {
    socket.emit('message', { text: self.message, lastimage: self.lastImage, username: self.username });
   // self.messages.push({ text: self.message, username: 'someuser' });
    self.message = null;
  }

self = this;
console.log ("webcamController loaded")



this.getVideo = function(){
  console.log("get video function called");

  video = document.querySelector("#videoElement");
   
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
   
  if (navigator.getUserMedia) {       
      navigator.getUserMedia({video: true}, handleVideo, videoError);
  }
   
  function handleVideo(stream) {
      video.src = window.URL.createObjectURL(stream);

}

  function videoError(e) {
      // do something
  }
  
}

this.takephoto = function() {
    var context = canvas.getContext('2d');
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
      var data = canvas.toDataURL('image/png');
      data = data.replace(/^data:image\/(png|jpg);base64,/, "")
      self.lastImage = data; // store ready to send in message

    console.log(self.lastImage)

      console.log (data);
      photo.setAttribute('src', data);

/////////////////// send webcam to server using SOCKETS ///////////
     

        // Sending the image data to Server
        /*    $.ajax({
                type: 'POST',
                url: 'Save_Picture/UploadPic',
                data: '{ "imageData" : "' + data + '" }',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function (msg) {
                    alert("Done, Picture Uploaded.");
                }
            });
*/
    } else {
     // clearphoto();
     console.log("something ERROR happened");
    }
  }

}