angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource'];
function MainController($auth, tokenService, $resource) {

  var self = this;

  self.loginDeets = {};
  self.currentUser = {};
  self.currentLocation = {};
  self.helloworld = "hello Angular";
  self.instagrams = [];


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
