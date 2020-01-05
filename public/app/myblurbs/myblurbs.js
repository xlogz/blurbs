mainApp.controller('myBlurbsCtrl', ['$scope', 'authService', '$http', function($scope, authService, $http){
	var user = $scope.getUserId();
	$scope.userObj;
	$scope.categories = [];

	$('.nav-item').on('click', function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	})

	$('#myTab li:first-child a').tab('show')

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

	 $scope.myCategories = function(){
	 	var userId = authService.getUserDBObject(user.username, function(userObject){
	 		$scope.userObject = userObject;
	 		var tempObj = {}
	 		console.log('this is the user object, retrieved for my categories');
	 		console.log(userObject);
	 		$http({
				method: 'GET',
				url: '/blurb/mycategories',
				headers: {id : userObject.data[0]._id}
			}).then(function(user){
				$scope.user = user.data;
				console.log('these are the user');
				console.log(user);

				for(var i = 0; i < user.data.categories.length; i++){
					var howManyBookmarks =user.data.categories[i].bookmarks.length;
					var bookmarks = [];
					var category = user.data.categories[i];
					tempObj.name = user.data.categories[i].name;
					tempObj.bookmarks = [];
					console.log('tempObj');
					console.log(tempObj);
					console.log(user.data.categories[i].name);
					console.log(user.data.categories[i].bookmarks);
					console.log(user.data.categories[i].bookmarks.length);
					for(var z = 0; z < howManyBookmarks; z++){
						bookmarks.push(category.bookmarks[z]);

					}
					tempObj.bookmarks = bookmarks;
					$scope.categories.push(tempObj);
				}


			})
	 	})
	 	console.log($scope.categories);
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
		$scope.myCategories();
	}
	init();
}])