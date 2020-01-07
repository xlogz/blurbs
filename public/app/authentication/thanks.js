mainApp.controller('thanksCtrl',['$state', function($state){
	setTimeout(function(){
		$state.go('home');
	}, 5000)
}])