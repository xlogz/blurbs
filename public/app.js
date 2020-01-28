var mainApp = angular.module('main', ['ui.router', 'ngCookies']);

mainApp.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$cookiesProvider', function($stateProvider,$urlRouterProvider,$locationProvider,$cookiesProvider) {
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

  var noAccesState = {
    name: 'noaccess',
    url: '/noaccess',
    templateUrl: './app/noaccess/noaccess.html',
  }

  var thankYouState = {
    name: 'thankyou',
    url: '/thankyou',
    templateUrl: './app/authentication/thankyou.html'
  }

  var profileState = {
    name: 'profile',
    url: '/profile?username',
    templateUrl: './app/profile/profile.html'
  }

  var blurbState = {
    name: 'blurb',
    url: '/blurb?id',
    templateUrl: './app/blurb/blurb.html'
  }

  $stateProvider.state(homeState);
  $stateProvider.state(myBlurbsState);
  $stateProvider.state(addBlurbState);
  $stateProvider.state(blurbsState);
  $stateProvider.state(aboutState);
  $stateProvider.state(registerState);
  $stateProvider.state(signInState);
  $stateProvider.state(callBackState);
  $stateProvider.state(noAccesState);
  $stateProvider.state(thankYouState);
  $stateProvider.state(profileState);
  $stateProvider.state(blurbState);


}]);

mainApp.controller('mainCtrl',['authService', '$scope', '$cookies','$rootScope', '$state', function(authService,$scope,$cookies,$rootScope,$state){

  $('.nav-item').on('click', function(){
  console.log('navbar item clicked');
  $('#navbarSupportedContent').removeClass('show');
  });

  var authCookie = $cookies.get('auth');
  console.log('this is the authtoken for logging in');
  console.log(authCookie);
  if(authService.isAuthenticated()){
    var user = authService.validateToken(authCookie, function(username){
    $rootScope.username = username;
    $scope.username = username.data[0].username;
    console.log($scope.username);
    console.log(username);
    console.log(username + ' has been verified');
    var userInfo = authService.getUserObject(username, function(userObj){
      $rootScope.user = userObj;
      $scope.user = userObj;
      $scope.currentUserId = userObj.data[0]._id;
      authService.currentUserId = $scope.currentUserId;

      console.log('initial loading of userObj');
      console.log(userObj);
    });
    
  });
  }

  $scope.goProfile = function(){
    var username;
    if(typeof $rootScope.username === "object" || $rootScope.username !== null){
    username = $rootScope.username.data[0].username;
    }
    if(username){
      console.log(username);
      $state.go('profile',{username: username});
    }else{
      $state.go('noaccess');
    }
  }


  

  
  
  $scope.user = authService.user;

  
  $scope.getUserObject = authService.getUserObject;
  $scope.isAuthenticated = authService.isAuthenticated;
  $scope.logout = function(){
    $scope.username = null;
    $rootScope.username = null;
    authService.logout();
  }
  $scope.login = authService.login;
  $scope.validateToken = authService.validateToken;
  $scope.user = authService.user;
  
}])

mainApp.directive('preventDefault', function(){
  return function(scope, element, attrs){
    angular.element(element.bind('click', function(event){
      event.preventDefault();
      event.stopPropagation();
    }))
  }
})
