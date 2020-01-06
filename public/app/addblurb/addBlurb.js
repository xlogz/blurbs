mainApp.controller('addBlurbCtrl', ['$scope', '$http', 'authService', 'blurbService', function($scope, $http, authService, blurbService){


	$scope.myCategories = function(username, callback){
	 	var userId = authService.getUserDBObject(username, function(userObject){
	 		$scope.userObject = userObject;

	 		console.log('this is the user object, retrieved for my categories');
	 		console.log(userObject);
	 		$http({
				method: 'GET',
				url: '/blurb/mycategories',
				headers: {name : username}
			}).then(function(user){
				$scope.user = user.data;

				blurbService.createCategoriesObj(user, function(categoriesArray){
					$scope.categories = categoriesArray;
					blurbService.createCategoriesList(categoriesArray, function(categoriesList){
						console.log(categoriesList);
						$scope.categoriesList = categoriesList;
					})
				})
				

			})
	 	})
	 }

	
	$scope.addBlurb = function(){
		var info = {};
		
		info.title = $scope.bookmark.title;
		info.url = $scope.bookmark.url;
		info.description = $scope.bookmark.description;
		info.private = $scope.bookmark.private;
		info.category = $scope.bookmark.category;
		info.categories = $scope.categories;

		blurbService.addBlurb(info);

		$scope.bookmark = {};

	}


		
		

	

	$scope.getUserCategoryList = function(){
		console.log($scope.categoriesList);
	}

	$scope.logbookmark = function(){
		console.log($scope.bookmark);
	}
	
		var init = function(){
			console.log()
			$scope.myCategories($scope.getUserId());
		}

		

	init();


}])