var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var User = mongoose.model('User');
var Bookmark = mongoose.model('Bookmark');
var Token = mongoose.model('Token');
var Category = mongoose.model('Category');


var controller = {};

controller.addCategory = function(req,res){
	console.log('received addCategory request');
	console.log(req.headers.title);
	var category = new Category({
		name: req.headers.title,
		owner: req.headers.userid 
	});

	category.save(function(error, category){
		User.updateOne({_id: req.headers.userid}, {$push: {categories: category._id}}).then(function(item){
				console.log(category);
				console.log('New category successfully added');
				res.status(201).send(category);
			
		})
	})
}

controller.deleteCategory = function(req, res){
	console.log(req.headers);
	var categoryId = req.headers.categoryid;
	var username = req.headers.username;
	var results = {}
	results.message = [];

	User.updateOne({username: username},{ $pull {categories: categoryId}).then(function(results){
		results.message.push(results);

		Category.findOneAndDelete({_id : categoryId}).then(function(results){
			results.message.push(results);
			res.send(results);
		});
	})

}

controller.addBlurb = function(req, res){
	console.log('');
	console.log('attempting to add blurb');
	console.log(req.headers);
	console.log(req.headers.bookmark);
	console.log('req.body.data' + req.headers.title);
	console.log(JSON.stringify(req.headers.bookmark))
	var bookmark = new Bookmark({
		_id: new mongoose.Types.ObjectId(),
		title: req.headers.title,
		url: req.headers.url,
		description: req.headers.description,
		private: req.headers.private,
		author: req.headers.author
	})

	bookmark.save(function(err, bookmark){
	console.log(bookmark._id)
	console.log(bookmark);
	console.log(req.headers.categoryid);

		Category.updateOne({_id: req.headers.categoryid}, {$push: {bookmarks: bookmark._id}}).then(function(item){
			
				console.log('New bookmark successfully added');
				res.status(201).send(bookmark._id);
			
		})



		// User.updateOne({_id: req.headers.author}, {$push: {bookmarks: bookmark._id}}, function(error, success){
		// 	if(err){
		// 		console.log(error)
		// 	}else{
		// 		console.log('Successfully Added');
		// 	}
		// } )
	})
	
}

controller.deleteBlurb = function(req, res){
	var results = {}

	console.log("deleting blurb - id:" + req.headers.bookmarkid + ' in category: ' + req.headers.categoryid);
	console.log(req.headers);

	Bookmark.findOneAndDelete({_id: req.headers.bookmarkid}).then(function(err, results){
		console.log('this is the result of finding and removing entry in bookmark collection')
		console.log(results);

		Category.updateOne({_id: req.headers.categoryid}, {pull: {bookmarks: req.headers.bookmarkid}}).then(function(item){
			
				console.log('bookmark successfully removed from category');
				console.log(item);
				res.status(201).send(item);
			
		})
	});
}


controller.myBlurbs = function(req, res){
	console.log('myBlurbs headers ID- ' + req.headers.id );

	User.
		findOne({_id: req.headers.id}).
		populate({path: 'bookmarks', model: 'Bookmark'}).
		exec(function(error, bookmarks){
			
			if(error){
				console.log('there was an error with getting users blurbs');
				res.status(401).send(err);
			}else{
				console.log('successfully found user. sending back bookmarks');
				console.log(bookmarks);
				res.status(201).send(bookmarks.bookmarks);
			}
			

		})

	
}



controller.myCategories = function(req, res){
	User.findOne({username: req.headers.name}).populate({path: 'categories', populate: {path: 'bookmarks'}}).exec(function(err,results){
		if(err){
			res.status(401).send(results);
		}else{
			res.status(200).send(results);	
		}
		
	})
}



module.exports = controller;