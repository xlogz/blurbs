mainApp.controller('addBlurbCtrl', ['$scope', '$http', 'authService', function($scope, $http, authService){
	

	


	$scope.addBlurb = function(){

		var user = authService.getUserId();
		console.log('getting user to pass into get user object');
		console.log(user.username)

		var userObject = authService.getUserDBObject(user.username, function(userObject){
			console.log('userObject');
			console.log(userObject);
			$scope.bookmark.author = userObject.data[0]._id;
			console.log('sending info to add a new blurb');
			console.log( $scope.bookmark)


			$http({
				method: 'put',
				url: '/blurb/bookmark',
				headers: $scope.bookmark
			}).then(function(id){
				console.log('This is the ID of the blurb we just added in the database');
				console.log(id);
				$scope.bookmark = {};
				return id;
			})
		});
		

	}

	$scope.logbookmark = function(){
		console.log($scope.bookmark);
	}
	

}])