mainApp.controller('thanksCtrl', ['$state','authService','$cookies', function($state,authService,$cookies){
	  var authCookie = $cookies.get('auth');
	  console.log('this is the authtoken for logging in');
	  console.log(authCookie);
	  if(authService.isAuthenticated()){
	    var user = authService.validateToken(authCookie, function(username){
	    $rootScope.username = username;
	    $scope.user = username;
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
	setTimeout(function(){
		$state.go('signin');
	},5000);
}])