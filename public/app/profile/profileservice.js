mainApp.service('profileService',['$http', function($http){
	function followUser(follower,followedUser, cb){
		var submit = {};
		submit.follower = follower;
		submit.followedUser = followedUser;
		$http({
			method: 'PUT',
			url: '/users/follow',
			data: submit
		}).then(function(results){
			if(cb){
				cb(results);
			}else{
				return results;
			}
			console.log(results);
		})
	}

	function unfollowUser(follower,followedUser, cb){
		var submit = {};
		submit.follower = follower;
		submit.followedUser = followedUser;
		$http({
			method: 'PUT',
			url: '/users/unfollow',
			data: submit
		}).then(function(results){
			console.log(results);
		})
	}


	function getFollowers(userId, cb){
		var submit = {};
		submit.userid = userId;
		// var submit = JSON.stringify(submit);
		console.log('getting followers for userid: ' + submit.userid);
		$http({
			method: 'PUT',
			url: '/users/followers',
			headers: {
				'Content-Type' : "application/json" 
			},
			data: submit
		}).then(function(results){
			if(cb){
				cb(results)
			}else{
				return results;
			}
		})
	}

	return{
		followUser : followUser,
		getFollowers: getFollowers,
		unfollowUser: unfollowUser
	}
}])