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
	console.log(req.headers.userid);
	var category = new Category({
		name: req.headers.title,
		owner: req.headers.userid 
	});

	category.save(function(error, category){
		console.log(req.headers.userid);
		User.updateOne({_id: req.headers.userid}, {$push: {categories: category._id}}).then(function(err,item){
				console.log(err);
				console.log(category);
				console.log(item);
				console.log('New category successfully added');
				res.status(201).send(category);
			
		})
	})
}

controller.deleteCategory = function(req, res){
	console.log('this is the deleteCategory headers');
	console.log(req.headers);
	var categoryId = req.headers.categoryid;
	var username = req.headers.username;
	var result = {}
	result.message = [];

	console.log('deleting ' + categoryId + ' from ' + username);

	User.updateOne({registeredUsername: username},{ $pull : {categories: categoryId}}).then(function(results){
		result.message.push(results);
		console.log('results of updating');
		console.log(results);

		Category.findOneAndDelete({_id : categoryId}).then(function(results){
			result.message.push(results);
			console.log('results of finding one and deleting');
			console.log(results);
			res.send(results);
		});
	})

}

controller.addBlurb = function(req, res){
	console.log('');
	console.log('attempting to add blurb');
	console.log(req.body);
	console.log(req.body.bookmark);
	console.log('req.body.data ' + req.body.title);
	var date = new Date();
	console.log(JSON.stringify(req.body.bookmark))
	var bookmark = new Bookmark({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		url: req.body.url,
		description: req.body.description,
		private: req.body.private,
		author: req.body.author,
		createdon: date,
		depth: 1
	})

	bookmark.save(function(err, bookmark){
		console.log('saving bookmark and adding to category')
	console.log(bookmark._id)
	console.log(bookmark);
	console.log('this is the categoryid to add to');
	console.log(req.body.categoryId);

		Category.updateOne({_id: req.body.categoryId}, {$push: {bookmarks: bookmark._id}}).then(function(item){
			
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

		Category.updateOne({_id: req.headers.categoryid}, {$pull: {bookmarks: req.headers.bookmarkid}}).then(function(item){
			
				console.log('bookmark successfully removed from category');
				console.log(item);
				res.status(201).send(item);
			
		})
	});
}

controller.addSubLink = function(req,res){
	console.log('headers for adding of sublink');
	console.log(req.body);
	var date = new Date();
	var depth = parseInt(req.body.depth) + 1;
	console.log('this should be the depth thats added');
	console.log(depth);
	var bookmarkObj = new Bookmark({
						title: req.body.title,
						url: req.body.url,
						description: req.body.description,
						createdon: date,
						depth: depth,
						private: req.body.private,
						author: req.body.author
	});
	bookmarkObj.save(function(err, bookmark){
		console.log(err);
		console.log(bookmark);
		console.log('adding new bookmark: ' + bookmark._id + ' to bookmark: ' + req.body.bookmarkid)
		if(err){
			res.status(400).send(err);
		}else{
			Bookmark.updateOne({_id: req.body.bookmarkid}, {$push : {relativelinks: bookmarkObj._id}}).then(function(results){
			console.log('relevant bookmark added to bookmark');
			console.log(results);
			res.status(200).send(results);
			})
		}

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
	User.findOne({registeredUsername: req.headers.name}).populate({path: 'categories', populate: {path: 'bookmarks', populate: {path: 'relativelinks', populate: {path: 'relativelinks', populate: {path: 'relativelinks', populate: {path: 'relativelinks', populate: {path: 'relativelinks', populate: {path: 'relativelinks', populate: {path: 'relativelinks', populate: {path: 'relativelinks', populate: {path: 'relativelinks', populate: {path: 'relativelinks'}}}}}}}}}}}}).exec(function(err,results){
		if(err){
			res.status(401).send(results);
		}else{
			res.status(200).send(results);	
		}
		
	})
}

controller.getLatestBlurbs = function(req, res){
	var count = req.headers.count;
	console.log('getting latest blurbs');

	count = parseInt(count);

	var results = Bookmark.find({private: false}).populate({path: 'author'}).sort({'createdon': -1}).limit(count).exec(function(err, bookmarks){
		if(err){
			console.log(err);
		}else{
			console.log(bookmarks);
			res.status(201).send(bookmarks);
		}
	});
	
}


controller.getRandomBlurbs = function(req, res){

	Bookmark.countDocuments({private: false}, function(err, count){
		var random = Math.abs(Math.floor(Math.random() * count));
		console.log('random: ' + random)

		Bookmark.find({private: false}).populate({path: 'author'}).skip(random).limit(1).exec(function(err, results){
				
				res.status(201).send(results);
		})
	});	
}


controller.getBlurbDetails = function(req, res){
	Bookmark.find({_id: req.headers.id}).populate({path: 'author'}).populate({path: 'comments', populate:{ path: 'author'}}).then(function(err,bookmark){
		if(err){
			res.send(err);
		}else{
			res.status(200).send(bookmark);
		}
	})
}


module.exports = controller;