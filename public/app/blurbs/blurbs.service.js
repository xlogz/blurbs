angular.module('main').factory('blurbsFactory' ['$http', function($http){
	var obj = {};


	obj.getUserBookmarks = function(){
		return $http({
			method: 'GET',
			url: '/users/bookmarks'
		}).then(function(response){
			return response;
		},
		function(error){
			console.log(error);
		})
	};

	obj.putUserBookmark = function(id){
		return $http({
			method: 'PUT',
			url: '/users/bookmark',
			data: {_id: id}
		}).then(function(response){
			return response;
		},
		function(error){
			console.log(error);
		})
	};



}]);