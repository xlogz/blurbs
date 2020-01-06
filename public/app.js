var mainApp = angular.module('main', ['ui.router', 'auth0.auth0', ]);

mainApp.config(['$stateProvider', 'angularAuth0Provider', '$urlRouterProvider', '$locationProvider', function($stateProvider,angularAuth0Provider,$urlRouterProvider,$locationProvider) {
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

  var signInState = {
    name: 'signin',
    url: '/signin',
    templateUrl: './app/authentication/signin.html'
  }

  var callBackState = {
    name: 'callback',
    url: '/callback',
    templateUrl: './app/callback/callback.html',

  }

  $stateProvider.state(homeState);
  $stateProvider.state(myBlurbsState);
  $stateProvider.state(addBlurbState);
  $stateProvider.state(blurbsState);
  $stateProvider.state(aboutState);
  $stateProvider.state(registerState);
  $stateProvider.state(signInState);
  $stateProvider.state(callBackState);

  var AUTH0_CLIENT_ID='x4QhXO346dfoY4wzVnWttmDAvFbQogAS'; 
  var AUTH0_DOMAIN='dev-kihm7h2g.auth0.com'; 
  var AUTH0_CALLBACK_URL='http://localhost:3000/#/callback';
   // Initialization for the angular-auth0 library
    angularAuth0Provider.init({
      clientID: AUTH0_CLIENT_ID,
      domain: AUTH0_DOMAIN,
      responseType: 'token id_token',
      redirectUri: AUTH0_CALLBACK_URL,
      scope: 'openid'
    });



    /// Comment out the line below to run the app
    // without HTML5 mode (will use hashes in routes)




}]);

mainApp.controller('mainCtrl',['authService', 'blurbService', '$scope', '$http',  function(authService,blurbService,$scope, $http){

  if (localStorage.getItem('isLoggedIn') === 'true') {

      authService.renewTokens();
    } else {
      // Handle the authentication
      // result in the hash
      authService.handleAuthentication();

    }
    // setTimeout(function(){
    //   authService.getUserInfo(); 
    // }, 500);
 
    //authService methods
  $scope.isAuthenticated = authService.isAuthenticated;
  $scope.logout = authService.logout;
  $scope.login = authService.login;
  $scope.getAccessToken = authService.getAccessToken;
  $scope.handleAuthentication = authService.handleAuthentication;
  $scope.getIdToken = authService.getIdToken;
  $scope.getUserInfo = authService.getUserInfo;
  $scope.getUserId = authService.getUserId;
  $scope.getTest = authService.getTest;
  $scope.getUserDBObject = authService.getUserDBObject;
  $scope.username = authService.username;
  $scope.email = authService.email;

  //blurbService methods
  $scope.getCategories = blurbService.getCategories;
    
  
}])

