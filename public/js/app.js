angular
  .module("VinceLynch", ['ngResource', 'satellizer', 'angular-jwt'])
  .config(oauthConfig);  

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