mainApp.factory('notificationsFactory', ['$http', function($http){
	var obj = {};
	obj.sendNotification = function(userid, data, cb){
		var submit = {};
		submit.userid = userid;
		submit.data = data
		$http({
			method: 'PUT',
			url: 'notification/send',
			data: submit

		}).then(function(results){
			if(cb){
				cb(results);
			}else{
				return results;
			}
		});
	}
	 return obj;
}])