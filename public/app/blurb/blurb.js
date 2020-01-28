mainApp.controller('blurbCtrl', ['$scope', 'blurbFactory', '$stateParams', function($scope, blurbFactory, $stateParams){
	function getBlurbDetails(id){
		console.log('retrieving ' + id)
		blurbFactory.getBlurbDetails(id, function(details){
			$scope.blurb = details.data[0];
			console.log($scope.blurb);
		});

	}

	console.log('loading blurb Ctrl');
	getBlurbDetails($stateParams.id);
}])