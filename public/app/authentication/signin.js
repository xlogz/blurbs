mainApp.controller('signInCtrl', ['$scope', 'angularAuth0', function($scope, angularAuth0){

	$scope.errorMessage = "none";


$scope.username = "";
$scope.password = "";

$scope.loginuser = function(){
	console.log('logging in user');
	angularAuth0.login({
		realm: 'Username-Password-Authentication',
		username: $scope.username,
		password: $scope.password
	}, function(error){
		if(error){
			console.log(error);
		}
	})
}



}]);
