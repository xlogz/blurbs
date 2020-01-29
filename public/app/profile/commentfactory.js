mainApp.factory('commentFactory', [ '$http', function($http){
	var obj = {};
	obj.submit = function(message, profileId, currentUserId, cb){
		var data = {message: message, profileId: profileId, author: currentUserId};
		data = JSON.stringify(data);
		$http({
			method: 'PUT',
			url: '/comments/wall/submit',
			data: data
		}).then(function(results){
			console.log(results);
			cb();
		})
	}

	obj.retrieveWallMessages = function(userId, cb){
		console.log('retrieving wall messages for user' );
		console.log(userId);
		var userInfo = {userId : userId}
		$http({
			method: 'GET',
			url: '/comments/wall/retrieve',
			headers: userInfo
		}).then(function(results){
			console.log('here are the results from retrieving wall messages');
			console.log(results);
			if(cb){
				cb(results);
			}else{
				return results;
			}
		})
	}

	obj.editAboutMe = function(aboutme, userId, cb){
		var submit = {}
		submit.aboutme = aboutme;
		submit.userid = userId;
		$http({
			method: 'PUT',
			url: '/aboutme/edit',
			data: submit
		}).then(function(results){
			console.log('here are the results from updating about me section');
			console.log(results);
			if(cb){
				cb(results);
			}else{
				return results;
			}
		})
	}

	obj.editWallComment = function(text, commentId, cb){
		var submit = {};
		submit.text = text;
		submit.id = commentId;

		$http({
			method: 'PUT',
			url: '/comments/wall/edit',
			data: submit
		}).then(function(results){
			console.log('here are the results from updating comment');
			console.log(results);
			if(cb){
				cb(results);
			}else{
				return results;
			}
		})
	}

	obj.deleteWallComment = function(userid, index, cb){
		var submit = {};
		submit.id = userid;
		submit.index = index;
		console.log('these are the details for deleteWallComment - userid: ' + userid + '  and index: ' + index )
		$http({
			method: 'DELETE',
			url: '/comments/wall/delete',
			headers: submit
		}).then(function(results){
			if(cb){
				cb(results);
			}else{
				return results;
			}
		})
	}

	obj.submitBlurbComment = function(userid, bookmarkid, message, cb){
		var submit = {};
		submit.userid = userid;
		submit.bookmarkid = bookmarkid;
		submit.message = message;
		$http({
			method: 'PUT',
			url: '/comments/blurb/submit',
			data: submit
		}).then(function(results){
			if(cb){
				cb(results)
			}else{
				return results;
			}
		})
	}


	return obj;
}])