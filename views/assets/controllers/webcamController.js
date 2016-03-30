
angular.module('VinceLynch')
.controller('webcamController', webcamController);

function webcamController($window) {

self = this;
console.log ("webcamController loaded")



this.getVideo = function(){
  console.log("get video function called");

  var video = document.querySelector("#videoElement");
   
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
      photo.setAttribute('src', data);
    } else {
     // clearphoto();
     console.log("something ERROR happened");
    }
  }

}