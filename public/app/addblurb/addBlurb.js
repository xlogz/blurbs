mainApp.controller('addBlurbCtrl', ['$scope', '$http', 'authService', '$state', function($scope, $http, authService, $state){
	if(!authService.isAuthenticated()){
		$state.go('noaccess');
	}else{
		console.log('user is logged in and can access page');
	}
}])