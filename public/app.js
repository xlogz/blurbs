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

  $stateProvider.state(homeState);
  $stateProvider.state(myBlurbsState);
  $stateProvider.state(addBlurbState);
  $stateProvider.state(blurbsState);
  $stateProvider.state(aboutState);
  $stateProvider.state(registerState);
  $stateProvider.state(signInState);
  $stateProvider.state(callBackState);
  $stateProvider.state(noAccesState);


}]);

mainApp.controller('mainCtrl',['authService', '$scope', '$cookies', function(authService,$scope,$cookies){

  $('.nav-item').on('click', function(){
  console.log('navbar item clicked');
  $('#navbarSupportedContent').removeClass('show');
  });

  var authCookie = $cookies.get('auth');
  console.log('this is the authtoken for logging in');
  console.log(authCookie);
  if(authService.isAuthenticated()){
    var user = authService.validateToken(authCookie, function(userObj){
    console.log(userObj);
    console.log(userObj + ' has been verified');
    var userInfo = authService.getUserObject();

    $scope.categories
  });
  }


  

  
  
  $scope.user = authService.user;
  
  $scope.getUserObject = authService.getUserObject;
  $scope.isAuthenticated = authService.isAuthenticated;
  $scope.logout = authService.logout;
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
