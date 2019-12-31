module.exports = function(app){
	var user = require('../controller/controller.js');

	app.route('/users/bookmarks').get(user.getUserBookmarks);
	app.route('/users/bookmarks').put(user.putUserBookmarks);
}