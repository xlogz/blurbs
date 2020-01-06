var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var User = mongoose.model('User');
var Bookmark = mongoose.model('Bookmark');
var Token = mongoose.model('Token');
var Category = mongoose.model('Category');
var request = require('request');

var controller = {};

controller.addCategory = function(req,res){
	console.log('received addCategory request');
	console.log(req.headers.title);
	console.log(req);
	var category = new Category({
		name: req.headers.title,
		owner: req.headers.userid 
	});

	category.save(function(error, category){
		User.updateOne({_id: req.headers.userid}, {$push: {categories: category._id}}).then(function(error,success){
			if(error){

				console.log(error);
				res.status(200).send(error);
			}else{
				console.log('New category successfully added');
				res.status(201).send(category._id);
			}
		})
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

		Category.updateOne({_id: req.headers.categoryid}, {$push: {bookmarks: bookmark._id}}).then(function(error,success){
			if(error){
				console.log(error);
				res.status(401).send(error);
			}else{
				console.log('New bookmark successfully added');
				res.status(201).send(bookmark._id);
			}
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




// controller.myCategories = function(req, res){
// 	var result = [];
// 	User.findOne({_id: req.headers.id}).then(function(user){
// 		user.categories.forEach(function(category, index, ins){
// 			console.log('creating new object to be filled with converted bookmarks');
// 			var bookmarkObj = {name: category.name};
// 			console.log(category.name);

// 			bookmarkObj.bookmarks = [];
// 			category.bookmarks.forEach(function(bookmarkId, index){
// 				var tempId = bookmarkId;
// 				console.log(tempId)
// 				Bookmark.find({_id: tempId }).then(function(bookmark){
// 					console.log(bookmark);
// 					bookmarkObj.bookmarks.push(bookmark)
// 				});
// 			});
// 			result.push(bookmarkObj);
// 		})

// 	}).then(function(){
// 		console.log(result);
// 		res.status(200).send(result);	
// 		});	
// }









// controller.myCategories2 = function(req, res){
// 	console.log('attempting to get myCategories')
// 	var bookmark = {};
// 	var result = [];


// 	User.findOneAsync({_id: req.headers.id}, function(err, user){

// 		console.log('this is the user from myCategories call');
// 		console.log(user);
// 		console.log('this is the users categories from myCategories call')
// 		console.log(user.categories.length);
// 			for(var i = 0; i < user.categories.length; i++){
// 				result.push(user.categories[i]);
// 				var bookmarks = [];
// 				console.log('this is result so far');
// 				console.log(result);
				

// 					for(var z = 0; z < user.categories[i].bookmarks.length; z++){
// 						var tempId = user.categories[i].bookmarks[z];
// 						console.log('this is the object were pulling bookmarks from');
// 						console.log(user.categories[i])

// 						console.log('this is the id of the bookmark');
// 						// console.log(tempId);

// 						Bookmark.find({_id: tempId }, function(err, bookmark){
// 							console.log
// 							if(err){
// 								console.log(err);
// 							}else if(bookmark){
// 								bookmarks.push(bookmark[0]);
// 								console.log('this is the bookmark after looking up id');
// 								console.log(bookmark);
// 								console.log('this is the result so far');
// 								console.log(result);
// 							}
							
// 						});

						
// 					}
// 				result[i].bookmarks = bookmarks;
				
// 			}
// 			res.status(201).send(result);
// 	});

			
		
// }










// controller.myCategories = function(req, res){
// 	console.log('attempting to get myCategories')
// 	var result = [];
// 	var categoryObj = {}
// 	User.findOne({_id: req.headers.id}, function(err, user){

// 		console.log('this is the user from myCategories call');
// 		console.log(user);
// 		console.log('this is the users categories from myCategories call')
// 		console.log(user.categories.length);
// 			for(var i = 0; i < user.categories.length; i++){
// 				categoryObj = {};
// 				console.log('pushing in user categories: ' + user.categories[i]) 
// 				User.findOne({_id: req.headers.id}).populate({path: 'categories', model: 'Category'}).exec(function(err, categories){
// 					var category = categories.categories[i-1]
// 					console.log('categories.name' + category.name)
// 					categoryObj.name = category.name;

// 					var bookmarksArray = [];
// 					User.findOne({_id: req.headers.id}).populate({path: 'categories', model: 'Category', populate: {path: 'bookmarks', model: 'Bookmark'}}).exec(function(err, bookmarks){
// 					var bookmark = bookmarks.categories[i-1];
// 					console.log('this is the populate looking up categories and bookmarks');
// 					console.log(bookmarks.categories[i-1]);
// 					console.log('we are on index ' + i +' of the loop because there are ' + user.categories.length + ' categories');
// 					console.log('about to loop through the bookmarks ' + bookmark.bookmarks.length + 'times');
// 					for(var z = 0; z < bookmark.bookmarks.length; z++){
// 						console.log(bookmark.bookmarks[z])
// 						console.log(z);
// 						bookmarksArray.push(bookmark.bookmarks[z]);
// 						console.log('pushing bookmark details into bookmark array');
// 					}
// 					categoryObj.bookmarks = bookmarksArray;
// 					console.log('setting bookmarks property of object we will return to the array we just built');
// 					console.log(categoryObj.bookmarks);
// 				})
// 				})
// 					console.log('pushing the object into the result array');
// 				result.push(categoryObj);

// 			}
// 			console.log('this is the result');
// 			console.log(result);
// 			res.status(201).send(result);
// 	})
		
// }


controller.myCategories = function(req, res){

	User.findOne({name: req.headers.name}).populate({path: 'categories', populate: {path: 'bookmarks'}}).exec(function(err,results){
		if(err){
			res.status(401).send(results);
		}else{
			res.send(results);	
		}
		
	})
}



module.exports = controller;