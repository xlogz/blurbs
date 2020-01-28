mainApp.controller('signInCtrl', ['$scope', '$http', '$state', '$cookies', 'authService', '$rootScope', function($scope, $http, $state, $cookies, authService, $rootScope){

	$scope.errorMessage = "none";

	$scope.signin = {};

	$scope.signin.username = "";
	$scope.signin.password = "";

	$scope.hasError = false;


	$scope.loginuser = function(event){
		event.preventDefault();

		var allUserInfo = $scope.signin;
		console.log('logging in user');

		$http({
			method: 'PUT',
			url: 'users/signin',
			headers: {
				'Content-Type' : "application/json"
			},
			data: {'credentials' : allUserInfo}
		}).then( function(response){
			console.log('this is the response from the server');
			console.log(response);
			if(response.data.loggedin){
				// var today = new Date();
			 //    var expirationDate = new Date();
			 //    expirationDate.setDate(today.getDate()+2);
				// $scope.username = allUserInfo.username;
				var expirationDate = new Date();
				expirationDate.setDate(expirationDate.getDate()+2);
				console.log(String(expirationDate));
				 var expirationDate = Math.floor ((new Date().getTime() + (60*60*48*1000))/1000);
				$cookies.put('auth', response.data.token, {expires:String(expirationDate)});
				console.log(response.data.token);
				console.log('this is the login result');
				$http({
					method: 'PUT',
					url: 'users/authtokenupdate',
					data: {'token' : response.data.token,
							'username' : $scope.signin.username}
				}).then( function(response){
					console.log('here is the response for updating auth token');
					console.log(response);

				})

				localStorage.setItem("username",allUserInfo.username);

				localStorage.setItem("initialLogin",true);


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
				      $state.go('home', {username: $scope.username});
				    });
				    
				  });
				  }


				
			}else{
				$scope.hasError = true;
				console.log('there is an error: ' + $scope.hasError)
				console.log('failed because');
				console.log(response.data.result);
				$scope.errorMessage = response.data.result;
				
			}
			return response;
		});
	}

	$scope.checkForError = function(){
		return $scope.hasError;
	}
}]);
