var user = require('../controller/controller.js');

module.exports = function(app){
	app.route('/users/bookmarks').get(user.getUserBookmarks);
	app.route('/users/bookmarks').put(user.putUserBookmark);
	app.route('/users/signup').post(user.signup);
}