mainApp.controller('addBlurbCtrl', ['$scope', '$http', 'authService', 'blurbService', function($scope, $http, authService, blurbService){


	$scope.myCategories = function(name, callback){
	 	var userId = authService.getUserDBObject(name, function(userObject){
	 		$scope.userObject = userObject;

	 		console.log('this is the user object, retrieved for my categories');
	 		console.log(userObject);
	 		$http({
				method: 'GET',
				url: '/blurb/mycategories',
				headers: {id : userObject.data[0]._id}
			}).then(function(user){
				$scope.user = user.data;

				blurbService.createCategoriesObj(user, function(categoriesArray){
					$scope.categories = categoriesArray;
					blurbService.createCategoriesList(categoriesArray, function(categoriesList){
						$scope.categoriesList = categoriesList;
					})
				})
				

			})
	 	})
	 }

	 $scope.myCategoryList = function(){
	 	var results = [];
	 	$scope.categories.forEach(function(categoryObj){
	 		results.push(categoryObj.name);
	 	})
	 	console.log('this is the result for categoryList');
	 	console.log(results);
	 	$scope.categoryList = results;
	 }


	

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

	$scope.getUserCategoryList = function(){
		console.log($scope.categoryList);
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