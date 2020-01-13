mainApp.controller('addBlurbCtrl', ['$scope', '$http', 'authService', 'blurbService', '$state', '$cookies', '$rootScope', function($scope, $http, authService, blurbService, $state, $cookies, $rootScope){
	if(!authService.isAuthenticated()){
		$state.go('noaccess');
	}else{
		console.log('user is logged in and can access page');


		var authCookie = $cookies.get('auth');

		authService.validateToken(authCookie, function(username){
		 	$scope.username = $rootScope.user || username;

		 	$scope.userid = username.data[0].userid;

		 	console.log(username)

		 	console.log('this is the users ID');
		 	console.log($scope.userid);
		 	
		 	blurbService.getCategories(username, function(results){
		 		$scope.categories = results.categories;
		 		$scope.categiesList = results.categoriesList;
		 		$scope.username = username;
		 		$rootScope.username = username;
		 		console.log('this is the user Obj after getting categories');
		 		console.log($scope.userObject);

		 	
		 	});

		});
	}
}])