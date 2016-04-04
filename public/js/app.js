angular
  .module("VinceLynch", ['ngResource', 'satellizer', 'angular-jwt', 'ui.router'])
  .config(oauthConfig)
  //.config(NGRouteR); 
  .config(Router);  

  oauthConfig.$inject = ['$authProvider', 'FACEBOOK_API_KEY', 'GITHUB_API_KEY', 'INSTAGRAM_API_KEY'];
  function oauthConfig($authProvider, FACEBOOK_API_KEY, GITHUB_API_KEY, INSTAGRAM_API_KEY){
    $authProvider.facebook({
      url: '/auth/facebook', // this is the place we are telling Satilette to tell facebook to send back its post request to.
      clientId: FACEBOOK_API_KEY
    });

    $authProvider.github({
      url: '/auth/github',
      clientId: GITHUB_API_KEY
    });

    $authProvider.instagram({
        url: '/auth/instagram',
       clientId: INSTAGRAM_API_KEY
     });


    $authProvider.tokenPrefix = null;

}
/////////// NG ROUTE /////////////////
/*NGRouteR.$inject = ['$routeProvider'];
function NGRouteR($routeProvider){
  $routeProvider.when("/",
    {
      templateUrl: "home.html",
      controller: "MainController",
      controllerAs: "main"
    }
  );
}*/



///////////// UI ROUTER /////////////

Router.$inject = ['$stateProvider', '$urlRouterProvider'];
function Router($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('front', {
      url: '/', 
      templateUrl: 'front.html'
    })
    .state('gifmaker',{
      url: '/gifmaker',
      templateUrl: 'gifmaker.html'
    })
    .state('login',{
      url: '/login',
      templateUrl: 'login.html'
    })
    .state('register',{
      url: '/login',
      templateUrl: 'login.html'
    })
    .state('instacity',{
      url: '/instacity',
      templateUrl: 'instacity.html'
    });
    

    $urlRouterProvider.otherwise('/');
  
}

   
