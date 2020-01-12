mainApp.service('blurbService', ['$http', 'authService', '$rootScope',  function($http, authService, $rootScope){
	var categories = [];
	var categoriesList = [];
	var userObj;
	var lastCategoryId

	function populateUserData (name, cb){
		var data = {};

			 	console.log('name getting passed to getCategories');
			 	console.log(name);

	 		getCategories(name, function(results){
	 		data.categories = results.categories;
	 		data.categoriesList = results.categoriesList;
	 		console.log('this is the user Obj after getting categories');
	 		if(cb){
	 			cb(data)
	 		}else{
	 			return data;
	 		}

	 	});

	}

	function createNewCategory (user, title, cb){
		var info = {};
		info.title = title;

		console.log('sending info.userId to /blurb/category');
		console.log('this is the user user id');
		console.log(user);
		console.log(user.data[0]._id);

		
		info.userid = user.data[0]._id;

		$http({
			method: 'PUT',
			url: '/blurb/category',
			headers: info
		}).then(function(categoryId){
			console.log(categoryId);
			
				if(cb){
					console.log('successfully added categories');
				
					console.log(categoryId);
				cb(categoryId)
				}else{
					return categoryId
				}
				console.log(categoryId);

				
			
		});
	}

	function deleteCategory (user, info, cb){
		console.log('deleting following info');
		console.log(info);
		submit = info;
		submit.username = user;
		http({
			method: 'PUT',
			url: 'blurb/category/delete',
			headers: submit }).then(function(result){
				console.log(result);
				if(cb){
					cb(result);
				}else{
					return result;
				}
			})
	}

	function createCategoriesObj (user, cb){
		console.log('this is user passed into createCategoriesObj');
		console.log(user);
		var result = []
		console.log(user.data.categories.length);
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



	function getCategories(username, cb){
		var resultObj = {};

		console.log('get categories userObject');
		console.log(username);
		var user = username;
		
	 		$http({
				method: 'GET',
				url: '/blurb/mycategories',
				headers: {name : user}
			}).then(function(user){
				console.log(user);
				resultObj.user = user.data;

				createCategoriesObj(user, function(categoriesArray){
					resultObj.categories = categoriesArray;
					$rootScope.lastcategoryId = resultObj.categories[resultObj.categories.length-1].id
					console.log($rootScope.lastcategoryId);
					createCategoriesList(categoriesArray, function(categoriesList){
						console.log(categoriesList);
						resultObj.categoriesList = categoriesList;
						if(cb){
							cb(resultObj)	
						}else{
							return resultObj;
						}
						
					})
				})
				

			
	 	})
	}

	function getCategoryId (categories, name, cb){
		var categoryList = categories;
		var categoryName = name;

		console.log('this is getCategoryId');
		console.log(categoryList);
		console.log(categoryName);
		var id;
		for(var i = 0; i < categoryList.length; i++){
			console.log('these two are being compared');
			console.log(categoryList[i].name);
			console.log(categoryName);
			if(categoryList[i].name === categoryName){
				id = categoryList[i]._id;
			}
			
		}
		if(cb){
			console.log('this is the ID we found for getCategoryId');
			console.log(id);
			cb(id);
		}else{
			return id;
		}
	}

	function addBlurb(bookmark, userObj, cb){
		var submit = bookmark;	


		getCategories(userObj, function(categoryObj){
			console.log('here is the categoryObj from getCategories from addBlurb');
			console.log(categoryObj);

			getCategoryId(categoryObj.user.categories, submit.category, function(id){

			submit.categoryId = id;
			submit.author = categoryObj.user._id;
			console.log('sending info to add a new blurb');
			console.log(categoryObj.user._id);


			console.log(id);

			$http({
				method: 'put',
				url: '/blurb/bookmark/add',
				headers: submit
			}).then(function(id){
				console.log('This is the ID of the blurb we just added in the database');
				console.log(id);

				if(cb){
					cb(id)
				}else{
					return id;	
				}
				

			})
		});
		})
		
	}

	function deleteBlurb(object, cb){
		submit = object;
		$http({
				method: 'put',
				url: '/blurb/bookmark/remove',
				headers: submit
			}).then(function(results){
				console.log('This is the results of the blurb we just added in the database');
				console.log(results);
				if(cb){
					cb(results);
				}else{
					return id;	
				}
				
			})
	}



	return{
		createCategoriesObj: createCategoriesObj,
		createCategoriesList: createCategoriesList,
		populateUserData: populateUserData,
		categories : categories,
		categoriesList : categoriesList,
		userObj : userObj,
		getCategories: getCategories,
		getCategoryId: getCategoryId,
		addBlurb: addBlurb,
		createNewCategory: createNewCategory,
		deleteBlurb: deleteBlurb,
	}
}]);
