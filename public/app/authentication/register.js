mainApp.controller('registerCtrl', ['$scope', 'angularAuth0', '$http', '$state', function($scope, angularAuth0, $http, $state){

	$scope.errorMessage = [];


	$scope.credentials = {};
	$scope.credentials.firstname = "";
	$scope.credentials.lastname = "";
	$scope.credentials.username = "";
	$scope.credentials.email = "";

	function checkPasswordValidity(password){
		var string = password;
		console.log(string);

		var invalidChars = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm);
		var results = invalidChars.test(string);

		return results;
	}

	// $scope.signUp = function(){

	// 	$scope.error = false;
	// 	console.log('was passord valid?');
	// 	console.log(checkPasswordValidity($scope.credentials.password));
	// 	if(!checkPasswordValidity()){
	// 		$scope.errorMessage = [];
	// 		$scope.errorMessage.push('Password must be at least 8 characters');
	// 		$scope.errorMessage.push('Must contain at least 1 uppercase, 1 lowercase, and 1 number');
	// 		$scope.errorMessage.push('Can contain special characters');
	// 		$scope.error = true;
	// 	}
	// 	console.log('first name' + $scope.credentials.firstname);
	// 	console.log('last name' + $scope.credentials.lastname);
	// 	console.log('username' + $scope.credentials.username);
	// 	var firstname = $scope.credentials.firstname;
	// 	var lastname = $scope.credentials.lastname;
	// 	var username = $scope.credentials.username;
	// 	var email = $scope.credentials.email;


	// 	var allUserInfo = $scope.credentials;
	// 	angularAuth0.signup({
	// 		client_id: 'x4QhXO346dfoY4wzVnWttmDAvFbQogAS', 
	// 		connection: 'Username-Password-Authentication',
	// 		username: $scope.credentials.username,
	// 		email: $scope.credentials.email,
	// 		password: $scope.credentials.password,
	// 		user_metadata: {firstname: $scope.credentials.firstname, lastname: $scope.credentials.lastname}


	// 	}, function(err){
	// 		if(err) {return console.log(err)}
	// 		else{
	// 			console.log('sending put request');
	// 			console.log(firstname+ '' + lastname + username + email);
	// 			var userInfo = {
	// 				firstName: firstname,
	// 				lastName: lastname,
	// 				username: username,
	// 				email: email}
	// 			}

	// 		 	$http({
	// 				method: 'PUT',
	// 				url: 'users/signup',
	// 				headers: {
	// 					'Content-Type' : "application/json"
	// 				},
	// 				data: {'credentials' : allUserInfo}
	// 			}).then( function(response){
	// 				console.log('success sign up and added to database');
	// 				if(response){
	// 					console.log('this is response from http for signup');
	// 					console.log(response);
	// 					return response;
	// 					$state.go('home');
	// 				}else{
	// 					console.log('there was an error with username')
	// 					$scope.errorMessage.push('The username has already been taken');
	// 					$scope.error = true;
	// 				}
					
	// 			})
				
			
	// 	});
	// }

	$scope.signUp = function(){

		$scope.error = false;
		console.log('was passord valid?');
		console.log(checkPasswordValidity($scope.credentials.password));
		if(!checkPasswordValidity($scope.credentials.password)){
			$scope.errorMessage = [];
			$scope.errorMessage.push('Password must be at least 8 characters');
			$scope.errorMessage.push('Must contain at least 1 uppercase, 1 lowercase, and 1 number');
			$scope.errorMessage.push('Can contain special characters');
			$scope.error = true;
		}
		console.log('first name' + $scope.credentials.firstname);
		console.log('last name' + $scope.credentials.lastname);
		console.log('username' + $scope.credentials.username);
		var firstname = $scope.credentials.firstname;
		var lastname = $scope.credentials.lastname;
		var username = $scope.credentials.username;
		var email = $scope.credentials.email;

		
		var allUserInfo = $scope.credentials;




		$http({
			method: 'PUT',
			url: 'users/signup',
			headers: {
				'Content-Type' : "application/json"
			},
			data: {'credentials' : allUserInfo}
		}).then( function(response){

			console.log('this is the object we got back from requesting to register');
			console.log(response);
			console.log(response.data.messages.length);
			console.log(response.data.messages);
			var results = response.data.messages;
			if(response.data.messages.length){
				if(!response.data.valid){	
				for(var i = 0; i < results.length; i++){
					console.log(results[i]);
					$scope.errorMessage.push(results[i])
					console.log($scope.errorMessage);
				}
				$scope.error = true;

				return response;
				
				}else{
					return;
				// $state.go('home');
				}
			}else{



			angularAuth0.signup({
			client_id: 'x4QhXO346dfoY4wzVnWttmDAvFbQogAS', 
			connection: 'Username-Password-Authentication',
			username: $scope.credentials.username,
			email: $scope.credentials.email,
			password: $scope.credentials.password,
			user_metadata: {firstname: $scope.credentials.firstname, lastname: $scope.credentials.lastname}


			}, function(err){
				if(err) {
					return console.log(err)
				}
				else{
					$state.go('thanks');
					}
			});
			}
		})
		
	}
}]);

