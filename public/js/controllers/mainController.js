angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource', '$window', '$state'];
function MainController($auth, tokenService, $resource, $window, $state) {
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

  var city = $window._.find(Cities, { name: country }).capital;
  console.log("city is: " + city);

  self.selected = {city: city, country: country};
  self.getCityNumTableData(city,country)
  self.getWikicityData(city)

  $state.transitionTo('city', {city: city, country: country});
}



  var Wikitable = $resource('http://localhost:8000/api/wikitable/:wikipage', {}, {
    get: { cache: true, method: 'get' }
  });



  

this.getWikiTable = function(){
  Wikitable.get({wikipage: "List_of_countries_by_inequality-adjusted_HDI"},function(data){
    data.rows.shift();
    console.log('success, got wikitable: ', data.rows);  
    self.wikitable = data.rows;   
    }, function(err){
    console.log('WikiTable Internal API - request failed');
    });
  }
  self.getWikiTable();
  


  var Instagram = $resource('http://localhost:8000/api/instagram/:lat/:lng', {}, {
    get: { cache: true, method: 'get' }
  });

  this.InstaLocationGet = function(lat, lng) {
    self.instagrams = Instagram.get({lat: lat, lng: lng}, function(data){
    console.log('success, got instagrams for this location: ', data);     
    self.instagrams = data.images.images;  
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
