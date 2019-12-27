var mainApp = angular.module('main', ['ui.router', 'auth0.auth0']);

mainApp.config(['$stateProvider', 'angularAuth0Provider', function($stateProvider,angularAuth0Provider) {
  var homeState = {
    name: 'home',
    url: '/home',
    templateUrl: './app/home/home.html'
  }

  var myBlurbsState = {
    name: 'myblurbs',
    url: '/myblurbs',
    templateUrl: './app/myblurbs/myblurbs.html'
  }

  var addBlurbState = {
    name: 'addblurb',
    url: '/new',
    templateUrl: './app/addblurb/addblurb.html'
  }

  var blurbsState = {
    name: 'blurbs',
    url: '/blurbs',
    templateUrl: './app/blurbs/blurbs.html'
  }


  var aboutState = {
    name: 'about',
    url: '/about',
    templateUrl: './app/home/home.html'
  }

    var registerState = {
    name: 'register',
    url: '/register',
    templateUrl: './app/authentication/register.html'
  }

  $stateProvider.state(homeState);
  $stateProvider.state(myBlurbsState);
  $stateProvider.state(addBlurbState);
  $stateProvider.state(blurbsState);
  $stateProvider.state(aboutState);
  $stateProvider.state(registerState);

  var AUTH0_CLIENT_ID='x4QhXO346dfoY4wzVnWttmDAvFbQogAS'; 
  var AUTH0_DOMAIN='dev-kihm7h2g.auth0.com'; 
  var AUTH0_CALLBACK_URL='http://localhost:3000/callback';
   // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: 'token id_token',
      redirectUri: AUTH0_CALLBACK_URL,
      scope: 'openid'
    });

}]);

 