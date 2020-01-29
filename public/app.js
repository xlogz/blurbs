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
    $scope.currentUsername = username.data[0].username;
    console.log($scope.username);
    console.log(username);
    console.log(username + ' has been verified');
    var userInfo = authService.getUserObject(username, function(userObj){
      $rootScope.user = userObj;
      $scope.user = userObj;
      $scope.currentUserId = userObj.data[0]._id;
      authService.currentUserId = $scope.currentUserId;
      console.log('these are the users notifications');
      console.log(userObj.data[0].notifications);
      // $scope.notifications = userObj.data[0].notifications;

      
      $scope.notifications = userObj.data[0].notifications;
      $scope.showNotifications = false;

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

  $scope.toggleNotifications = function(){
    console.log('toggleNotifications clicked');
    console.log($scope.showNotifications);
    $scope.showNotifications = !$scope.showNotifications;
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

 mainApp.filter('trustAsHtml',['$sce', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(text);
    };
  }]);

 mainApp.directive('compileHtml', ['$compile', function ($compile) {
                return {
                  $compile : $compile,
                  priority: 1000,
                  link: function(scope, element, attr){
                    scope.$watch(attr.compileHtml, function(newVal, oldVal){
                      if(newVal){
                        console.log('this is scope from compilehtml');
                        console.log(scope);
                        console.log('this is element from compileHtml');
                        console.log(element.contents());
                        console.log('this is attr from compilehtml');
                        console.log(attr.compileHtml);
                        element.html(newVal);
                        $compile(element.contents())(scope);
                      }
                    })
                  }}
            }]);

//  var CompileHtmlDirective = (function () {
//     function CompileHtmlDirective($compile) {
//         this.$compile = $compile;
//         this.priority = 1000;
//         this.link = function (scope, element, attr) {
//             scope.$watch(attr.compileHtml, function (newVal, oldVal) {
//                 if (newVal) {
//                     element.html(newVal);
//                     $compile(element.contents())(scope);
//                 }
//             });
//         };
//     }

//     return CompileHtmlDirective;
// })();