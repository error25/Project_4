$( document ).ready(function() {
    console.log( "jquery ready!" );

    gifshot.createGIF({

      // Desired width of the image 
      'gifWidth': 400,
      // Desired height of the image 
      'gifHeight': 400,


    }, function(obj) {
      if(!obj.error) {

        var image = obj.image,
        animatedImage = document.createElement('img');
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
      }
    });

});
