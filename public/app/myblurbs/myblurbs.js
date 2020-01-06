mainApp.controller('myBlurbsCtrl', ['$scope', 'authService', '$http', 'blurbService', function($scope, authService, $http, blurbService){
	var user = $scope.getUserId();
	$scope.userObj;
	$scope.categories = [];
	$scope.categoryList = [];
	$scope.collapsed = true;

	$('.nav-item').on('click', function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	})


	$('.card .collapse').collapse('show');


	$scope.collapseAll = function(){
		$('.card .collapse').collapse('hide');
		$scope.collapsed = true;
	}

	$scope.expandAll = function(){
		$('.card .collapse').collapse('show');
		$scope.collapsed = false;
	}


	// $scope.categories = [
	// 	{name: "Welcome", bookmarks:[{id: "1", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is your homepage where you can see all of the categories for your bookmarks. You can add them to an existing category or add one here"},
	// 								 {id: "2", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is a second link with more information about your home page"},
	// 								 {id: "3", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is your third link that you've added. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious"}]}, 
	// 	{name: "Welcome", bookmarks:[{id: "1", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is your homepage where you can see all of the categories for your bookmarks. You can add them to an existing category or add one here"},
	// 								 {id: "2", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is a second link with more information about your home page"},
	// 								 {id: "3", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is your third link that you've added. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious"}]}, 
	// 	{name: "Welcome", bookmarks:[{id: "1", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is your homepage where you can see all of the categories for your bookmarks. You can add them to an existing category or add one here"},
	// 								 {id: "2", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is a second link with more information about your home page"},
	// 								 {id: "3", title: "This is an example blurb", url: "http://www.yoururlhere.com", description: "This is your third link that you've added. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious. Lorum Ipsum Potato Tomato Pokemon Supercalifragilisticexpialidocious"}]}, 

	//  ];

	$scope.newCategory = function(){
		var categoryTitle = $scope.category.title;
		blurbService.createNewCategory(categoryTitle, function(result){
			$scope.getUserInfo(0, function(username){
				console.log('this is the username being passed to getMyCategories');
				console.log(username);
				$scope.myCategories(username);
			});
		})

	}



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
					console.log($scope.categories);
					blurbService.createCategoriesList(categoriesArray, function(categoriesList){
						console.log(categoriesList);
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


	$scope.myBlurbs = function(){
		
		var userID = authService.getUserDBObject(user.username, function(userObject){
			$scope.userObj = userObject;
			console.log('getmyblurbs userobject');
			console.log(userObject);
			$http({
				method: 'GET',
				url: '/blurb/myblurbs',
				headers: {id : userObject.data[0]._id}
			}).then(function(bookmarks){
				$scope.bookmarks = bookmarks.data;
				console.log('these are the bookmarks');
				console.log(bookmarks);
			})
		})
	}

	var init = function(){
		var myCategoriesPromise = new Promise(function(resolve, reject){
			$scope.myCategories()
			if($scope.categories !== []){
				console.log('it worked! beginning promise');
				resolve('Stuff Worked');
			}else{
				reject(Error('It broke'))
			}
		});

		var myCategoriesListPromise = function(){
			return new Promise(function(resolve,reject){
				var message = "The promise worked. loading categories list";
				resolve(message);

			})
		} 
		
		
	}
	

	$scope.getUserInfo(0, function(username){
			console.log('this is the username being passed to getMyCategories');
			console.log(username);
			$scope.myCategories(username, function(){
				$('#myTab li:nth-child(2) a').tab('show');
			});
	});


	init();
	
}])