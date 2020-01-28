var mongoose = require('mongoose');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var controller = {};

controller.submitWallMessage = function(req, res){
	console.log('here is submitwallmessage coming in');
	console.log(req.body);
	var date = new Date();
	var comment = new Comment({text: req.body.message, author: req.body.author, createdon: date});
	comment.save(function(result){
		User.updateOne({_id: req.body.profileId}, {$push : {wall : comment._id}}).then(function(results){
			res.status(200).send(results);
		});
	});
}

controller.retrieveWallMessages = function(req, res){
	console.log(req.headers);
		User.find({_id: req.headers.userid}).populate({path: 'wall', model: 'Comment' , populate : {path: 'author', model: 'User'}}).exec(function(error, user){
			if(error){
				res.status(401).send(error);
			}else{
				console.log('successfully found user. sending back wall comments');
				console.log(user);
				console.log(user);
				res.status(201).send(user)
			}
		})
}

controller.editAboutMe = function(req,res){
	User.updateOne({_id: req.body.userid}, {aboutme: req.body.aboutme}).then(function(results){

			console.log('editAboutMe updated');
			res.status(200).send(results);
		
	})

}

controller.editWallComment = function(req, res){
	console.log('editing wall comment');
	console.log(req.body.id);
	console.log(req.body.text);
	Comment.updateOne({_id: req.body.id}, {text: req.body.text}).then(function(results){
		console.log('comment updated');
		res.status(200).send(results);
	})
}


controller.deleteWallComment = function(req, res){
	console.log(req.body);
	console.log(req.headers);
	User.find({_id: req.headers.id}).then(function(user){
		console.log(user);
		var updatedWall = user[0].wall;
		var indexOfSplice = ( user[0].wall.length - 1) - req.headers.index;
		updatedWall.splice(indexOfSplice,1);
		console.log(updatedWall);
		User.updateOne({_id: req.headers.id}, {wall: updatedWall}).then(function(results){
			console.log('wall has been updated');
			res.status(200).send(results);
		})
	})
}

module.exports = controller;