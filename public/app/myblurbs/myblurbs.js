mainApp.controller('myBlurbsCtrl', ['$scope', 'authService', '$http', 'blurbService', '$rootScope','$cookies', function($scope, authService, $http, blurbService,$rootScope,$cookies){
	$scope.user = authService.user;
	$scope.collapsed = true;
	$scope.currentTabId = "";
	$scope.error = false;
	$scope.errorMessage = [];
	$scope.treeCount = 0;


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

		console.log(e.target.id);
		$scope.currentTabId = e.target.id;
		$rootScope.currentTabId = e.target.id;
		$scope.currentCategory = e.target.text;
		$rootScope.currentCategory = e.target.text;
		console.log('currentCategory being set to: ' + $scope.currentCategory);
		if(hamburgerOpen === true){
			$('#category-list').css('display', 'none');
		}
	});

	$scope.hamburgerOpen = false;

	$('#tab-hamburger').on('click', function(){
		if($scope.hamburgerOpen === false){
			$('#category-list').css('display', 'inline-block');
			$('#category-list').addClass('animated');
			$('#category-list').addClass('fadeIn');
			$scope.hamburgerOpen = true;
		}else{
			$('#category-list').css('display', 'none');
			$scope.hamburgerOpen = false;
		}
		
		
	})

	childrenCount = [];
	$scope.maxNum = 0;


	// $scope.addDepth = function (arr, depth = 0) {
	//   arr.forEach(obj => {
	//     console.log(depth);
	//     $scope.addDepth(obj.children, depth + 1)
	//   })
	// }

	// $scope.countChildren = function(children, count=0){
	// 	var hasChildren = false;
	// 	console.log(count);
	// 	if(count > $scope.maxNum){
	// 		$scope.maxNum = count;
	// 	}

	// 		for(var i = 0; i < children.length; i++){
				
	// 				$scope.countChildren(children[i].relativelinks, count+1) 
				
			
	// 	}
	// 	console.log('the max num is ' + $scope.maxNum);

	// }


	



	$('.card .collapse').collapse('show');

	function checkForInvalidChar(target){
		var string = target;

		var invalidChars = new RegExp(/^[0-9a-zA-Z]+$/);
		var results = invalidChars.test(string);

		return results;

	}

	function checkForInvalidLink(target){
		var string = target;
		var invalidLink = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig)
		var results = invalidLink.test(string);

		return results;
	}

	$scope.addBlurb = function(){

		console.log('checking for invalid link:')
		console.log(checkForInvalidLink($scope.bookmark.url));
		
		if(!checkForInvalidLink($scope.bookmark.url)){
			$scope.error = true;
			$scope.errorMessage.push("Please enter a valid link");
			return;
		}
		console.log('clicking addBlurb');
		var info = {};
		
		info.title = $scope.bookmark.title;
		info.url = $scope.bookmark.url;
		info.description = $scope.bookmark.description;
		info.private = $scope.bookmark.private;
		info.category = $scope.currentCategory;
		info.categories = $scope.categories;
		console.log('here is rootSCopeusername in addBlurb and current category');
		console.log($rootScope.username);
		console.log($rootScope.currentCategory);
		blurbService.addBlurb(info, $rootScope.username, $rootScope.currentCategory,  function(id){
			console.log('herr is scope.username');
			console.log($scope.username);
			blurbService.populateUserData($rootScope.username,function(data){
			console.log('this is the data after populateUserData was retrieved');
			console.log(data);
			$scope.categories = data.categories;
			$scope.categoriesList = data.categoriesList;
			$scope.userObject = data.userObject;

			setTimeout(function(){
				console.log('switching to the tab');
				console.log($rootScope.currentTabId)
				$scope.error = false;
				$('#' + $rootScope.currentTabId).tab('show');
			},50)
		})
		});

		$scope.bookmark = {};

		$('#addBlurbModal').modal('toggle');


		$scope.bookmark.title = "";
		$scope.bookmark.url = "";
		$scope.bookmark.description = "";
		$scope.bookmark.private = "";

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


	$scope.addSubLinkData = function(bookmarkid, depth){
		if(depth === 5){
			$('#maxSubLinkModal').modal('toggle');
		}else{
			$('#addSubLinkModal').modal('toggle');
			$scope.bookmarkid = bookmarkid;
			$scope.depth = depth;
		}

	}

	$scope.addSubLink = function(bookmarkid){
		console.log('checking for invalid link:')
		console.log(checkForInvalidLink($scope.bookmark.url));
		
		if(!checkForInvalidLink($scope.sublink.url)){
			$scope.error = true;
			$scope.errorMessage.push("Please enter a valid link");
			return;
		}
		console.log('addSubLink clicked');
		var info = {};

		info.title = $scope.sublink.title;
		info.url = $scope.sublink.url;
		info.description = $scope.sublink.description;
		info.bookmarkid = $scope.bookmarkid;
		info.depth = $scope.depth;
		info.private = $scope.sublink.private
		if($scope.depth === 5){
			$scope.errorMessage = "Sublink for this branch has reached its maximum capacity";
			$scope.error = true;
		}else{
			console.log('this is the bookmark we are attaching new link to: ' + info.bookmarkid)


		blurbService.addSubLink(info, function(){
			blurbService.populateUserData($scope.username, function(data){
				setTimeout(function(){console.log(data);
					setTimeout(function(){
						$scope.error = false;
						$('#' + $scope.currentTabId).tab('show');
					},20)
				},20)
			});
		});

		$scope.sublink.title = "";
		$scope.sublink.url = "";
		$scope.sublink.description = ""

		$('#addSubLinkModal').modal('toggle');

		}
		


		
	}

	$scope.deleteCategoryData = function(categoryid){
		console.log('deleteCAtegoryData clicked');
		$scope.categoryToDelete = categoryid;
		$('#deleteCategoryModal').modal('toggle');
	}

	$scope.deleteCategory = function(element){
		var submit = {};
		submit.categoryid = $scope.categoryToDelete;
		blurbService.deleteCategory(submit, $scope.username,function(result){
			console.log('this is the result of delete Cateogry');
			console.log(result);
			$('#deleteCategoryModal').modal('toggle');
			blurbService.populateUserData($scope.username, function(data){
				$scope.categories = data.categories;
				$scope.categoriesList = data.categoriesList;
				$scope.userObject = data.userObject
				// setTimeout(function(){
				// 	$('.nav-tabs .nav-item:nth-child(2)').tab('show');
				// },20)
			});

		})
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
			blurbService.populateUserData($scope.username, function(data){
			console.log('going back to original tab');
			console.log($scope.currentTabId);
			$scope.categories = data.categories;
			$scope.categoriesList = data.categoriesList;
			$scope.userObject = data.userObject
			setTimeout(function(){
				$('#' + $scope.currentTabId).tab('show');
			},20)
			
			});

		});
		$('#deleteBlurbModal').modal('toggle');




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

		
			console.log($scope.userid);

			var categoryTitle = $scope.category.title;
			blurbService.createNewCategory($scope.userid,categoryTitle, function(result){
				console.log('this is the id of the new category');
				console.log(result.data._id);
				console.log('this is the ')
				console.log($scope.user);
				blurbService.populateUserData($scope.username, function(data){
				console.log('going back to original tab');
				console.log($scope.currentTabId);
				$scope.categories = data.categories;
				$scope.categoriesList = data.categoriesList;
				$scope.userObject = data.userObject
				$rootScope.currentTabId = result.data._id
				console.log('this is the currentTabId after creating '
					 + result.data.title)
				

				$rootScope.currentTabId = $rootScope.currentTabId + "-tab";

				console.log($rootScope.currentTabId);

				setTimeout(function(){
					$('#' + result.data._id + '-tab').tab('show');
					
					$rootScope.currentCategory = categoryTitle;
				},50);
				
				

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
	 	$scope.username = $rootScope.user || username;
	 	console.log(username);

	 	$scope.userid = username.data[0].userid;

	 	console.log(username)

	 	console.log('this is the users ID');
	 	console.log($scope.userid);
	 	
	 	blurbService.getCategories(username, function(results){
	 		console.log('results from getCategories');
	 		console.log(results);
	 		$scope.categories = results.categories;
	 		$scope.categiesList = results.categoriesList;
	 		$scope.username = username;
	 		$rootScope.username = username;
	 		console.log('this is the user Obj after getting categories');
	 		console.log($scope.userObject);
	 		setTimeout(function(){
	 			$('.nav-item:nth-child(2)').tab('show')
	 		}, 50)
	 		

	 	
	 })

	 })
	 
	 $scope.property = "title";
	 $scope.reverse = true;

	 $scope.sortBy = function(property){
	 	$scope.reverse = ($scope.property === property) ? $scope.reverse : false;
	 	$scope.property = property;
	 }

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

mainApp.directive('showOnHoverTitle', function(){
	return {
		link: function(scope, element) {
			 element.on("mouseover", function(event){

        element[0].children[1].style.opacity=1;
        element[0].children[1].style.display='inline-block';
      });
      element.on("mouseleave", function(event){
        element[0].children[1].style.opacity=1;
        element[0].children[1].style.display='none';
		})
	}
	}

}).directive('showOnHover', function(){
	return {
		link: function(scope, element) {
			 element.on("mouseover", function(event){

        element[0].children[0].style.opacity=1;
        // element[0].children[0].style.display='inline-block';
      });
      element.on("mouseleave", function(event){
        // element[0].children[0].style.opacity=0;
        // element[0].children[0].style.display='none';
		})
	}
	}

})