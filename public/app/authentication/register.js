mainApp.controller('registerCtrl', ['$scope', 'angularAuth0', function($scope, angularAuth0){

	$scope.errorMessage = "none";


	$scope.credentials = {};
	$scope.credentials.firstname = "";
	$scope.credentials.lastname = "";
	$scope.credentials.username = "";
	$scope.credentials.password = "";
	$scope.credentials.email = "";


	$scope.signUp = function(){
		console.log('first name' + $scope.credentials.firstname);
		console.log('last name' + $scope.credentials.lastname);
		console.log('username' + $scope.credentials.username);

		angularAuth0.signup({
			client_id: 'x4QhXO346dfoY4wzVnWttmDAvFbQogAS', 
			connection: 'Username-Password-Authentication',
			username: $scope.credentials.username,
			email: $scope.credentials.email,
			password: $scope.credentials.password,
			user_metadata: {firstname: $scope.credentials.firstname, lastname: $scope.credentials.lastname}

		}, function(err){
			if(err) return console.log(err)
			return alert('success signup without login')
		});
	}




}]);

