var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var User = mongoose.model('User');
var Notification = mongoose.model('Notification');
var controller = {};


controller.sendNotification = function(req, res){
	console.log('creating notification');
	var notification = new Notification({text: req.body.data.text,
										from: req.body.data.from,
										fromUsername: req.body.data.fromUsername,
										createdon: req.body.data.createdon,
										viewed: false});
	User.updateOne({_id : req.body.userid}, {$push : {notifications: notification}}).then(function(result){
		console.log('notification sent to user ' + req.body.userid)
		res.status(200).send(result);
	})
}

module.exports = controller;