angular.module('VinceLynch')
.controller('MainController', MainController);

MainController.$inject = ['$auth', 'tokenService', '$resource'];
function MainController($auth, tokenService, $resource) {

  var self = this;

  self.loginDeets = {};
  self.currentUser = {};


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
