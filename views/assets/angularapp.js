angular
  .module("VinceLynch", ['ngResource', 'satellizer', 'angular-jwt']);
  .constant('API_URL', 'http://localhost:3000')
  .config(oauthConfig);

  oauthConfig.$inject = ['API_URL', '$authProvider', 'FACEBOOK_API_KEY', 'GITHUB_API_KEY'];
  function oauthConfig(API_URL, $authProvider, FACEBOOK_API_KEY, GITHUB_API_KEY){
    $authProvider.facebook({
      url: API_URL + '/auth/facebook', // this is the place we are telling Satilette to tell facebook to send back its post request to.
      clientId: FACEBOOK_API_KEY
    });

    $authProvider.github({
      url: API_URL + '/auth/github',
      clientId: GITHUB_API_KEY
    });


    $authProvider.tokenPrefix = null;

  }