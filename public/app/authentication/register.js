mainApp.controller('registerCtrl', ['$scope', 'angularAuth0', '$http', '$state', function($scope, angularAuth0, $http, $state){

	$scope.errorMessage = "none";


	$scope.credentials = {};
	$scope.credentials.firstname = "";
	$scope.credentials.lastname = "";
	$scope.credentials.username = "";
	$scope.credentials.email = "";


	$scope.signUp = function(){
		console.log('first name' + $scope.credentials.firstname);
		console.log('last name' + $scope.credentials.lastname);
		console.log('username' + $scope.credentials.username);
		var firstname = $scope.credentials.firstname;
		var lastname = $scope.credentials.lastname;
		var username = $scope.credentials.username;
		var email = $scope.credentials.email;

		var allUserInfo = $scope.credentials;
		angularAuth0.signup({
			client_id: 'x4QhXO346dfoY4wzVnWttmDAvFbQogAS', 
			connection: 'Username-Password-Authentication',
			username: $scope.credentials.username,
			email: $scope.credentials.email,
			password: $scope.credentials.password,
			user_metadata: {firstname: $scope.credentials.firstname, lastname: $scope.credentials.lastname}


		}, function(err){
			if(err) {return console.log(err)}
			else{
				console.log('sending put request');
				console.log(firstname+ '' + lastname + username + email);
				var userInfo = {
					firstName: firstname,
					lastName: lastname,
					username: username,
					email: email}
				}

			 	$http({
					method: 'PUT',
					url: 'users/signup',
					headers: {
						'Content-Type' : "application/json"
					},
					data: {'credentials' : allUserInfo}
				}).then( function(response){
					console.log('success sign up and added to database');
					console.log(response);
					return response;
					$state.go('home');
				})
				
			
		});
	}




}]);

