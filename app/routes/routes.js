var user = require('../controller/user.controller.js');
var blurb = require('../controller/blurb.controller.js');
var comment = require('../controller/comment.controller.js');

module.exports = function(app){

	app.route('/blurb/category/delete').put(blurb.deleteCategory);
	app.route('/blurb/category').put(blurb.addCategory);
	app.route('/blurb/bookmark/add').put(blurb.addBlurb);
	app.route('/blurb/bookmark/remove').put(blurb.deleteBlurb);
	app.route('/blurb/myblurbs').get(blurb.myBlurbs);
	app.route('/blurb/mycategories').get(blurb.myCategories);
	app.route('/blurb/sublink/add').put(blurb.addSubLink);

	app.route('/blurb/latest').get(blurb.getLatestBlurbs);
	app.route('/blurb/random').get(blurb.getRandomBlurbs);
	app.route('/blurb/details').get(blurb.getBlurbDetails);

	app.route('/comments/wall/submit').put(comment.submitWallMessage);
	app.route('/comments/wall/retrieve').get(comment.retrieveWallMessages);
	app.route('/comments/wall/edit').put(comment.editWallComment);
	app.route('/comments/wall/delete').delete(comment.deleteWallComment);

	app.route('/aboutme/edit').put(comment.editAboutMe);


	app.route('/users/bookmarks').get(user.getUserBookmarks);
	app.route('/users/bookmarks').put(user.putUserBookmark);

	app.route('/users/signup').put(user.signup);
	app.route('/users/signin').put(user.signin);
	
	app.route('/users/validatetoken').get(user.validateToken);
	app.route('/users/authtokenupdate').put(user.authTokenUpdate);

	app.route('/users/userobject').get(user.getUserObject);

	app.route('/users/follow').put(user.followUser);
	app.route('/users/followers').put(user.getFollowers);

}