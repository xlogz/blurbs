mainApp.controller('registerCtrl', ['$scope', '$http', '$state', function($scope, $http, $state){

	$scope.errorMessage = [];
	$scope.hasError = false;


	$scope.credentials = {};
	$scope.credentials.firstname = "";
	$scope.credentials.lastname = "";
	$scope.credentials.username = "";
	$scope.credentials.email = "";
	$scope.credentials.password = "";


	$scope.signUp = function(){
		console.log('first name' + $scope.credentials.firstname);
		console.log('last name' + $scope.credentials.lastname);
		console.log('username' + $scope.credentials.username);
		var firstname = $scope.credentials.firstname;
		var lastname = $scope.credentials.lastname;
		var username = $scope.credentials.username;
		var email = $scope.credentials.email;
		var password = $scope.credentials.password;

		var allUserInfo = $scope.credentials;


			 	$http({
					method: 'PUT',
					url: 'users/signup',
					headers: {
						'Content-Type' : "application/json"
					},
					data: {'credentials' : allUserInfo}
				}).then( function(response){
					if(response.data.taken === true){
						console.log('there were errors in signing up');
						$scope.hasError = true;
						$scope.errorMessage = response.data.error;
						console.log($scope.errorMessage);
					}else{
						console.log('success sign up and added to database');
						console.log(response);
						$state.go('home');
					}
					
					


				})
			
			
		
	}
	$scope.checkForError = function(){
		return $scope.hasError;
	}




}]);

