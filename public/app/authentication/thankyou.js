mainApp.controller('thanksCtrl', ['$state', function($state){
	setTimeout(function(){
		$state.go('signin');
	},5000);
}])