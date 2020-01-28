mainApp.factory('blurbFactory', ['$http', function($http){
	var obj = {};

	obj.getLatestBlurbs = function(skipCount, cb){
		var submit = {};
		submit.count = skipCount;
		$http({
			method: 'GET',
			url: '/blurb/latest',
			headers: submit
		}).then(function(results){
			cb(results);
		})
	}

	obj.getRandomBlurbs = function(count, cb){
		var submit = {};
		submit.count = count;
		$http({
			method: 'GET',
			url: '/blurb/random',
			headers: submit
		}).then(function(results){
			if(cb){
				cb(results);
			}else{
				return results;
			}
		});
	}

	obj.getBlurbDetails = function(id, cb){
		var submit = {};
		submit.id = id;
		$http({
			method: 'GET',
			url: '/blurb/details',
			headers: submit
		}).then( function(results){
			if(cb){
				cb(results)
			}else{
				return results;
			}
		})
	}

	return obj;
}]);