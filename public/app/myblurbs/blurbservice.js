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

	function createNewCategory (title, cb){
		var info = {};
		info.title = title;
		var user = authService.getUserInfo(0, function(user){
			authService.getUserDBObject(user, function(userObject){
				info.userid = userObject.data[0]._id;
				console.log('sending info.userId to /blurb/category');
				console.log(info.userId);
				$http({
					method: 'PUT',
					url: '/blurb/category',
					headers: info
				}).then(function(error,result){
					if(error){
						console.log(error);
						return error;
					}else{
						console.log(result);
						if(cb){
							console.log(result);
							cb(result)
						}else{
							return result
						}
					}
				})
			});
		});
	}

	function createCategoriesObj (user, cb){
		var result = []

		if(user.data.categories.length){
			for(var i = 0; i < user.data.categories.length; i++){
			var howManyBookmarks = user.data.categories[i].bookmarks.length;
			var bookmarks = [];
			var category = user.data.categories[i];
			var tempObj = {};
			tempObj.name = user.data.categories[i].name;
			tempObj.id = user.data.categories[i]._id;
			tempObj.bookmarks = [];
			for(var z = 0; z < howManyBookmarks; z++){
				bookmarks.push(category.bookmarks[z]);

			}
			tempObj.bookmarks = bookmarks;
			result.push(tempObj);
			}

			if(cb){
				cb(result);
			}else{
				return result;
			}
		}else{
			return [];
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

	function getCategoryId (categories, name, cb){
		var categoryList = categories;
		var categoryName = name;
		var id;
		for(var i = 0; i < categoryList.length; i++){
			if(categoryList[i].name === categoryName){
				id = categoryList[i].id;
			}
			
		}
		if(cb){
			cb(id);
		}else{
			return id;
		}
	}

	function addBlurb(bookmark, cb){
		var submit = bookmark;	
		var user = authService.getUserInfo(0, function(user){
			console.log('getting user to pass into get user object');
			console.log(user)

			authService.getUserDBObject(user, function(userObject){
				console.log('this is the userobject from add blurb');
				console.log(userObject);
				getCategoryId(submit.categories, submit.category, function(id){
		
					submit.categoryId = id;
					submit.author = userObject.data[0]._id;
					console.log('sending info to add a new blurb');
	
					console.log(id);

					$http({
						method: 'put',
						url: '/blurb/bookmark',
						headers: submit
					}).then(function(id){
						console.log('This is the ID of the blurb we just added in the database');
						console.log(id);

						return id;
					})
				});
				
			});

		});
	}



	return{
		createCategoriesObj: createCategoriesObj,
		createCategoriesList: createCategoriesList,
		populateUserData: populateUserData,
		categories : categories,
		categoriesList : categoriesList,
		userObj : userObj,
		getCategoryId: getCategoryId,
		addBlurb: addBlurb,
		createNewCategory: createNewCategory
	}
}]);
