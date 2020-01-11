var user = require('../controller/user.controller.js');
var blurb = require('../controller/blurb.controller.js');

module.exports = function(app){

	app.route('/blurb/category').put(blurb.addCategory);
	app.route('/blurb/bookmark/add').put(blurb.addBlurb);
	app.route('/blurb/bookmark/remove').put(blurb.deleteBlurb);
	app.route('/blurb/myblurbs').get(blurb.myBlurbs);
	app.route('/blurb/mycategories').get(blurb.myCategories);



	app.route('/users/bookmarks').get(user.getUserBookmarks);
	app.route('/users/bookmarks').put(user.putUserBookmark);

	app.route('/users/signup').put(user.signup);
	app.route('/users/signin').put(user.signin);
	
	app.route('/users/validatetoken').get(user.validateToken);
	app.route('/users/authtokenupdate').put(user.authTokenUpdate);

	app.route('/users/userobject').get(user.getUserObject);

}