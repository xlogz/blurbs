var mongoose = require('mongoose');
var User = mongoose.model('User');
var Bookmark = mongoose.model('Bookmark');

var controller = function(){};

console.log('loading controller')

controller.getUserBookmarks = function(req, res){
	return User.find({_id: req.user._id}, function(err, item){
		res.send(item[0].bookmarks);
	});
}

controller.putUserBookmark = function(req, res){
	var bookmark = new Bookmark(req.body);
	return User.find({_id: req.user._id}, function(err, item){
		item[0].bookmarks.push(bookmark);
		bookmark.save();
		User.update({_id: req.user._id}, {bookmarks: item[0].bookmarks}, {upsert: true}, function(err, item){
			res.send();
		});
	});
}

module.exports = controller;