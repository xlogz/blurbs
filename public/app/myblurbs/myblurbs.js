mainApp.controller('myBlurbsCtrl', ['$scope', 'authService', '$http', 'blurbService', '$rootScope','$cookies', function($scope, authService, $http, blurbService,$rootScope,$cookies){
	$scope.user = authService.user;
	$scope.collapsed = true;
	$scope.currentTabId = "";
	$scope.error = false;
	$scope.errorMessage = [];


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

	$('.navbar-nav .nav-item').on('click', function (e) {
	  e.preventDefault();
	  $(this).tab('show');
	})


	$('body').on('click', '.nav-tabs .nav-item', function(e){
		$scope.currentTabId = e.target.id;
		$scope.currentCategory = e.target.text;

	});



	



	$('.card .collapse').collapse('show');

	function checkForInvalidChar(target){
		var string = target;

		var invalidChars = new RegExp(/^[0-9a-zA-Z]+$/);
		var results = invalidChars.test(string);

		return results;
	}

	$scope.addBlurb = function(){

		console.log('clicking addBlurb');
		var info = {};
		
		info.title = $scope.bookmark.title;
		info.url = $scope.bookmark.url;
		info.description = $scope.bookmark.description;
		info.private = $scope.bookmark.private;
		info.category = $scope.currentCategory;
		info.categories = $scope.categories;
		console.log('passing in userObject to addBlurb');
		console.log($scope.userObject);
		blurbService.addBlurb(info, $scope.userObject, function(){


authService.validateToken(authCookie, function(username){
	 	console.log(username)
	 	authService.getUserObject(username, function(userObj){
		console.log('making changes');
	 	console.log(userObj);
	 	blurbService.getCategories(userObj, function(results){
	 		$scope.categories = results.categories;
	 		$scope.categiesList = results.categoriesList;
	 		$scope.userObject = userObj;
	 		console.log('this is the user Obj after getting categories');
	 		console.log($scope.userObject);
	 		setTimeout(function(){
				$('#' + $scope.currentTabId).tab('show');
			},20)
			

			
		
		});

		$scope.bookmark = {};

		$('#addBlurbModal').modal('toggle');

		
				
		// blurbService.populateUserData($scope.user,function( data){
		// 	console.log('going back to original tab');
		// 	console.log($scope.currentTabId);
		// 	$scope.categories = data.categories;
		// 	$scope.categoriesList = data.categoriesList;
		// 	$scope.userObject = data.userObject
		// 	setTimeout(function(){
		// 		$('#' + $scope.currentTabId).tab('show');
		// 	},20)
			
		// });
	}

	$scope.deleteBlurbData = function(bookmarkid, categoryid){
		$scope.bookmarkToDelete = bookmarkid;
		$scope.categoryOfBookmarkToDelete = categoryid;
		console.log('storing ids into scope');
		console.log($scope.bookmarkToDelete + ' ' +bookmarkid);
		console.log($scope.categoryOfBookmarkToDelete + ' ' +categoryid);

		$('#deleteBlurbModal').modal('toggle');
	}
	$scope.deleteBlurb = function(element){
		var submit = {};
		submit.bookmarkid = $scope.bookmarkToDelete;
		submit.categoryid = $scope.categoryOfBookmarkToDelete;
		console.log('submitting following object to send delete info')
		console.log(submit);
		blurbService.deleteBlurb(submit, function(results){
			console.log('sucessfully deleted blurb. here are the results:');
			console.log(results);


			authService.validateToken(authCookie, function(username){
	 	console.log(username)
	 	authService.getUserObject(username, function(userObj){
		console.log('making changes');
	 	console.log(userObj);
	 	blurbService.getCategories(userObj, function(results){
	 		$scope.categories = results.categories;
	 		$scope.categiesList = results.categoriesList;
	 		$scope.userObject = userObj;
	 		console.log('this is the user Obj after getting categories');
	 		console.log($scope.userObject);

	 		setTimeout(function(){
				$('#' + $scope.currentTabId).tab('show');
			},20)

	 	});
	 })

	 })


			
			
			
			
		});


	}


	$scope.collapseAll = function(){
		$('.card .collapse').collapse('hide');
		$scope.collapsed = true;
	}

	$scope.expandAll = function(){
		$('.card .collapse').collapse('show');
		$scope.collapsed = false;
	}



	$scope.newCategory = function(){
		console.log(!checkForInvalidChar($scope.category.title));

		if(!checkForInvalidChar($scope.category.title)){
			$scope.errorMessage.push("Enter alphanumeric characters");
			$scope.error = true;
			return;
		}

		if($scope.category.title.length < 3){
			$scope.errorMessage.push("Minimum character length of 3");
			$scope.error = true;
			return
		}
			$scope.error=false;
			$('#addCategoryModal').modal('toggle');

		
			

			var categoryTitle = $scope.category.title;
			blurbService.createNewCategory($scope.userObject,categoryTitle, function(result){
				console.log('this is the id of the new category');
				console.log(result.data._id);
				console.log('this is the current scope user');
				console.log($scope.user);
				blurbService.populateUserData($scope.user, function(data){
				console.log('going back to original tab');
				console.log($scope.currentTabId);
				$scope.categories = data.categories;
				$scope.categoriesList = data.categoriesList;
				$scope.userObject = data.userObject


				setTimeout(function(){
					$('#' + result.data._id + '-tab').tab('show');
				},20);
				
				

				})

		

		

	})

}



	 $scope.myCategories = function(userObject, callback){

	 		blurbService.getCategories(userObject);
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

	 var authCookie = $cookies.get('auth');

	 authService.validateToken(authCookie, function(username){
	 	console.log(username)
	 	authService.getUserObject(username, function(userObj){
		console.log('making changes');
	 	console.log(userObj);
	 	blurbService.getCategories(userObj, function(results){
	 		$scope.categories = results.categories;
	 		$scope.categiesList = results.categoriesList;
	 		$scope.userObject = userObj;
	 		console.log('this is the user Obj after getting categories');
	 		console.log($scope.userObject);

	 	});
	 })

	 })
	 
	 

	// $scope.myBlurbs = function(){
		
	// 	var userID = authService.getUserDBObject(user.username, function(userObject){
	// 		$scope.userObj = userObject;
	// 		console.log('getmyblurbs userobject');
	// 		console.log(userObject);
	// 		$http({
	// 			method: 'GET',
	// 			url: '/blurb/myblurbs',
	// 			headers: {id : userObject.data[0]._id}
	// 		}).then(function(bookmarks){
	// 			console.log('these are the bookmarks!!!!!!!!!!');
	// 			$scope.bookmarks = bookmarks.data;
	// 			console.log('these are the bookmarks');
	// 			console.log(bookmarks);
	// 		})
	// 	})
	// }




	// $scope.getUserInfo(0, function(username){
	// 		console.log('this is the username being passed to getMyCategories');
	// 		console.log(username);
	// 		$scope.myCategories(username, function(){
	// 			$('#myTab li:nth-child(2) a').tab('show');
	// 		});
	// });

	
}])