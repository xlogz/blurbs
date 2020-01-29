mainApp.controller("profileCtrl", ["$scope", "$stateParams", "authService", 'commentFactory', '$rootScope', 'profileService', 'notificationsFactory',function($scope,$stateParams,authService, commentFactory, $rootScope, profileService, notificationsFactory){
	console.log($stateParams);
	$scope.userProfileName = $stateParams.username;
	$scope.message = "";
	$scope.sameUser = false;
	$scope.editingAboutMe = false;
	$scope.isFollowing = false;

	var username = $scope.userProfileName;
	var userObj = {};


	authService.getUserObject(username, function(object){
		userObj = object;

		console.log(userObj);

		$scope.username = userObj.data[0].username;
		$scope.firstname = userObj.data[0].firstname;
		$scope.lastname = userObj.data[0].lastname;
		$scope.userProfileId = userObj.data[0]._id;
		$scope.aboutMe = userObj.data[0].aboutme;

		$scope.retrieveWallMessages($scope.userProfileId,function(){
			console.log('this is the rootscope current user');
			$scope.currentUserId = $rootScope.user.data[0]._id;

			if($scope.userProfileId === $scope.currentUserId){
				$scope.sameUser = true;
			}else{
				$scope.sameUser = false;
			}
			console.log($rootScope.user.data[0]._id);
			console.log('comparing ' + $scope.currentUserId + ' with ' + $scope.userProfileId);
			console.log($scope.sameUser);

			var aboutMeText = document.getElementById('aboutMeText');
			console.log(aboutMeText.textContent);
			var content = aboutMeText.textContent.trim();

			$scope.aboutMeTextArea = content;

			$scope.getFollowers($scope.userProfileId, function(results){
				$scope.following = results.data.following;
				console.log(results.data);
				$scope.getFollowers($scope.currentUserId, function(results){
					console.log(results.data);
					for(var i = 0; i < results.data.following.length; i++){
						if($scope.username === results.data.following[i].username){
							$scope.isFollowing = true;
						}
					}
				})
			});
		});
	});

	$scope.editAboutMe = function(){
		commentFactory.editAboutMe($scope.aboutMeTextArea, authService.currentUserId, function(){

			$scope.aboutMe = $scope.aboutMeTextArea;

			$('#editAboutMeModal').modal('toggle');

		})

	}


	$scope.submitWallMessage = function(){
		commentFactory.submit($scope.message, $scope.userProfileId, authService.currentUserId, function(){
			$scope.retrieveWallMessages($scope.userProfileId);
			document.getElementById('wallTextField').value = "";
		});
	}

	$scope.retrieveWallMessages = function(userId, cb){
		commentFactory.retrieveWallMessages(userId, function(user){
			$scope.wall = user.data[0].wall;
			console.log(user.data[0]);
			if(cb){
				cb()
			}
			
		});
	}

	$scope.editWallComment = function(userComment, id){
	$scope.userCommentEdit = userComment;
	$scope.userCommentEditId = id;
		console.log(userComment);
		$('#editWallCommentModal').modal('toggle');
		document.getElementById('editWallCommentTextArea').value = userComment;
	}

	$scope.submitEditWallComment = function(){
		var message = document.getElementById('editWallCommentTextArea').value;
		commentFactory.editWallComment(message, $scope.userCommentEditId, function(){
			$scope.retrieveWallMessages($scope.userProfileId);
		})
		$('#editWallCommentModal').modal('toggle');
	}

	$scope.deleteWallComment = function(index){
		$scope.deleteWallCommentindex = index;
		console.log('deleting index ' + index + ' of wall array');
		$('#deleteWallCommentModal').modal('toggle');
	}

	$scope.deleteCommentConfirmed = function(){
		console.log('delete comment confirmed... now sending index to backend to be removed');
		console.log($scope.userProfileId);
		console.log($scope.deleteWallCommentindex);
		commentFactory.deleteWallComment($scope.userProfileId,$scope.deleteWallCommentindex, function(){
			var wallComments = $scope.wall;
			console.log('successfully deleted comment');
			wallComments.splice($scope.deleteWallCommentindex,1);
			$scope.retrieveWallMessages($scope.userProfileId);
			$('#deleteWallCommentModal').modal('toggle');
		});
	}

	$scope.followUser = function(currentUserName, profileUsername){
		console.log('following user');
		console.log(currentUserName + ' '+ profileUsername);
		$scope.isFollowing = true;
		profileService.followUser($scope.currentUserId,$scope.userProfileId, function(){
			var data = {};
			data.text = 'You have a new follower! <a ui-sref="profile({username: notification.fromUsername})">' + currentUserName + ' </a> has started following.';
			data.from = $scope.currentUserId;
			data.fromUsername = currentUserName;
			data.createdon = new Date();
			console.log('submitting data for notifications');
			console.log(data);
			notificationsFactory.sendNotification($scope.userProfileId, data, function(){

			});
		})
	}


	$scope.unfollowUser = function(){
		console.log('unfollowing user');
		$scope.isFollowing = false;
		profileService.unfollowUser($scope.currentUserId,$scope.userProfileId, function(){

		})
	}

	$scope.getFollowers = function(id,cb){
		console.log('getting userProfileId')
		profileService.getFollowers(id, function(results){
			console.log(results);
			if(cb){
				cb(results);
			}else{
				return results;
			}

		});
	}


		


	$scope.$watch(function(authService){
		return authService.currentUserId;

	},
	function(newValue, oldValue){
		
		var userId = authService.currentUserId;
		$scope.currentUserId = authService.currentUserId;
		console.log('this is authService.currentUserId: ' + userId);
		

	},true)
	



	
}]);

mainApp.directive('editHover', function(){
	return {
		link: function(scope, element) {
			 element.on("mouseover", function(event){
			 	console.log(element[0].children[1]);
        element[0].children[1].style.opacity=1;
        element[0].children[1].style.display='inline-block';
      });
      element.on("mouseleave", function(event){
        element[0].children[1].style.opacity=1;
        element[0].children[1].style.display='none';
		})
	}
	}

})