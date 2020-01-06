mainApp.service('blurbService', ['$http', 'authService', function($http, authService){
	var categories = [];
	var categoriesList = [];
	var userObj;

	function populateUserData (user){
		var userId = authService.getUserDBObject(user, function(userObject){
	 		userObj = userObject;

	 		console.log('this is the user object, retrieved for my categories');
	 		console.log(userObject);
	 		$http({
				method: 'GET',
				url: '/blurb/mycategories',
				headers: {id : userObject.data[0]._id}
			}).then(function(user){
				$scope.user = user.data;

				createCategoriesObj(user, function(categoriesArray){
					categories = categoriesArray;
					createCategoriesList(categoriesArray, function(categoriesList){
						categoriesList = categoriesList;
					})
				})
				

			})
	 	})
	}

	function createCategoriesObj (user, cb){
		var result = []
		for(var i = 0; i < user.data.categories.length; i++){
			var howManyBookmarks = user.data.categories[i].bookmarks.length;
			var bookmarks = [];
			var category = user.data.categories[i];
			var tempObj = {};
			tempObj.name = user.data.categories[i].name;
			tempObj.bookmarks = [];
			for(var z = 0; z < howManyBookmarks; z++){
				bookmarks.push(category.bookmarks[z]);

			}
			tempObj.bookmarks = bookmarks;
			result.push(tempObj);
		}if(cb){
			cb(result);
		}else{
			return result;
		}
	
	}

	function createCategoriesList (category, cb){
		var array = category;
		var results = []
		for(var i = 0; i < array.length; i++){
			results.push(array[i].name);
		}
		if(cb){
			cb(results);
		}else{
			return results;
		}
	}

	return{
		createCategoriesObj: createCategoriesObj,
		createCategoriesList: createCategoriesList,
		populateUserData: populateUserData,
		categories : categories,
		categoriesList : categoriesList,
		userObj : userObj
	}
}]);
