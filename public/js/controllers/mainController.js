angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource', '$window', '$state', 'GEOCODER_API_KEY', '$http', 'GUARDIAN_API_KEY'];
function MainController($auth, tokenService, $resource, $window, $state, GEOCODER_API_KEY, $http, GUARDIAN_API_KEY) {
  var self = this;

  self.loginDeets = {};
  self.currentUser = {};
  self.currentLocation = {};
  self.helloworld = "hello Angular";
  self.instagrams = [];
  self.searchPlace = {};
  self.wikitable = {};
  self.selected = {};
  self.summary = {};
  self.detailed = {};
  self.wikicity = {};
  self.country = {};
  self.guardianarticles = [];
  
 // http://content.guardianapis.com/search?q=millennials%2C%20cities&api-key=

var Guardian = $resource('http://content.guardianapis.com/search?q=millennials%2C%20cities&api-key=' + GUARDIAN_API_KEY, {}, {
});

this.getGuardianArticles= function(){
  Guardian.get(function(data){
    console.log('success, got Guardian Articles: ', data);  
   self.guardianarticles = data.response.results;
   console.log(self.guardianarticles);
    }, function(err){
    console.log('Guardian Articles API - request failed');
    });
}
this.getGuardianArticles();


var Geocoder = $resource('https://maps.googleapis.com/maps/api/geocode/json?address=' + self.selected.city + "+" + self.selected.country +  '&key=' + GEOCODER_API_KEY, {}, {
});


this.getGeoCode = function(){
  $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + self.selected.city + "+" + self.selected.country +  '&key=' + GEOCODER_API_KEY).success(function(data){
    console.log(data.results[0].geometry.location);
    self.selected.lat = data.results[0].geometry.location.lat;
    self.selected.lng = data.results[0].geometry.location.lng;
    self.InstaLocationGet(self.selected.lat,self.selected.lng)
  });
}


var Wikicity = $resource('http://localhost:8000/api/wikicity/:city', {}, {
  get: { cache: true, method: 'get' }
});

this.getWikicityData = function(city){
    Wikicity.get({city: city},function(data){
      console.log('success, got Wikicity: ', data);  
      self.wikicity = data;
      }, function(err){
      console.log('Wikicity Internal API - request failed');
      });
  }

this.getLatLngRESTcountries = function(city){
  $http.get('https://restcountries.eu/rest/v1/capital/' + city).success(function(data){
    console.log(data);
  });
}

var Numtable = $resource('http://localhost:8000/api/numtable/:city/:country', {}, {
  get: { cache: true, method: 'get' }
});

this.getCityNumTableData = function(city, country){
  Numtable.get({city: city, country: country},function(data){
    console.log('success, got Numdata: ', data);  
    self.summary = data.summary;
    self.detailed = data.details;
    }, function(err){
    console.log('Numdata Internal API - request failed');
    });
}

this.gotoCity = function(country){  //lodash
  self.country = $window._.find(Cities, { name: country });
  var city = self.country.capital;
  console.log(self.country)
  console.log("city is: " + city);

  self.selected = {city: city, country: country};
  self.getCityNumTableData(city,country)
  self.getWikicityData(city)
  self.getGeoCode();

  $state.transitionTo('city', {city: city, country: country});
}



  var Wikitable = $resource('http://localhost:8000/api/wikitable/:wikipage', {}, {
    get: { cache: true, method: 'get' }
  });



  

this.getWikiTable = function(wikititle){
  Wikitable.get({wikipage: wikititle},function(data){
    data.rows.shift();
    console.log('success, got wikitable: ', data.rows);  
    self.wikitable = data.rows; 
    var lat = data.rows.wikisummary  
    // self.InstaLocationGet(lat, lng) 
    }, function(err){
    console.log('WikiTable Internal API - request failed');
    });
  }
  
  


  var Instagram = $resource('http://localhost:8000/api/instagram/:lat/:lng', {}, {
    get: { cache: true, method: 'get' }
  });

  this.createGifFromInstas = function(){
    gifshot.createGIF({
      'images': self.instagrams,
      'text': self.selected.city,
      'gifWidth': 400,
      'gifHeight': 300,
      'fontSize': '30px',
      'interval': 0.25,
      'resizeFont': true,
      'textBaseline': 'bottom',
       //['http://i.imgur.com/2OO33vX.jpg', 'http://i.imgur.com/qOwVaSN.png', 'http://i.imgur.com/Vo5mFZJ.gif']
    },function(obj) {
      if(!obj.error) {
        var image = obj.image,
        animatedImage = document.createElement('img');
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
      }
    });
  }

  this.InstaLocationGet = function(lat, lng) {
    self.instagrams = Instagram.get({lat: lat, lng: lng}, function(data){
    console.log('success, got instagrams for this location: ', data);     
    self.instagrams = data.images.images;  
    self.instagrams.pop();
    self.createGifFromInstas() // create Gifs for City
    }, function(err){
    console.log('API Instagram Location - request failed');
    });
  }

  this.showlocation = function() {
     // One-shot position request.
     navigator.geolocation.getCurrentPosition(self.callback);
  }
   
  this.callback = function(position) {
     self.currentLocation.lat = position.coords.latitude;
     self.currentLocation.lng = position.coords.longitude;
     self.InstaLocationGet(self.currentLocation.lat, self.currentLocation.lng)
  }


  this.login = function(){
    console.log("Submitted login with" + self.loginDeets.email + "password: " + self.loginDeets.password )
    $auth.login(self.loginDeets)
  }

  this.register = function(){
    console.log("Submitted register with" + self.loginDeets.email + "password: " + self.loginDeets.password )
    $auth.signup(self.currentUser)
  }

  this.isLoggedIn = function() {
    return !!tokenService.getToken();
  }

  this.currentUser = tokenService.getUser();

  this.authenticate = function(provider) {
    $auth.authenticate(provider)
      .then(function() {
        self.currentUser = tokenService.getUser();
      });
  }

  this.logout = function() {
    tokenService.removeToken();
    this.currentUser = null;
  }

}
