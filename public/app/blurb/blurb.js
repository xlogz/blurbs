mainApp.controller('blurbCtrl', ['$scope', 'blurbFactory', '$stateParams', 'commentFactory', function($scope, blurbFactory, $stateParams, commentFactory){
	function getBlurbDetails(id, cb){
		console.log('retrieving ' + id)
		blurbFactory.getBlurbDetails(id, function(details){
			$scope.blurb = details.data[0];
			$scope.comments = details.data[0].comments;
			console.log($scope.blurb);
			if(cb){
				cb();
			}
		});

	}

	$scope.submitComment = function(){
		console.log($scope.currentUserId)
		commentFactory.submitBlurbComment($scope.currentUserId, $stateParams.id, $scope.message, function(results){
			console.log(results);

		})
		
	}

	console.log('loading blurb Ctrl');
	getBlurbDetails($stateParams.id);
}])