$( document ).ready(function() {
    console.log( "jquery ready!" );

    gifshot.createGIF({ // options

      // Desired width of the image 
      'gifWidth': 400,
      // Desired height of the image 
      'gifHeight': 400,
      'keepCameraOn': false,
      'interval': 0.1,
      'numFrames': 5,
      'saveRenderingContexts': true,

    }, function(obj) {
      if(!obj.error) {

        var image = obj.image,
        animatedImage = document.createElement('img');
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
    
        console.log(obj.savedRenderingContexts) //64bit string of the gif
      }
      gifshot.stopVideoStreaming();
    });

});
