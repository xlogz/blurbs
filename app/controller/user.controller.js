var mongoose = require('mongoose');
var User = mongoose.model('User');
var Bookmark = mongoose.model('Bookmark');
var Category = mongoose.model('Category');
var Token = mongoose.model('Token');

var jwt = require('jsonwebtoken');


var db = mongoose.connection;

var controller = function(){};

console.log('loading controller');

controller.validateToken = function(req, res){
	var results = {};
	results.status = 201;
	console.log(req.headers);
	console.log('this is the req.body.authToken from validateToken');
	Token.find(hashedToken: req.headers.token}).then(function(user){
	console.log('results from searching authtoken');
		if(user){
			console.log('user found');
			console.log(user);
			res.status(results.status).send(user);
		}else{
			res.status(401).send(user);
		}
		
	});
}



controller.getUserBookmarks = function(req, res){
	return User.find({_id: req.user._id}, function(err, item){
		console.log('Getting user bookmarks');
		res.send(item[0].bookmarks);
		
	});
}

controller.putUserBookmark = function(req, res){
	var bookmark = new Bookmark(req.body);
	User.find({_id: req.user._id}, function(err, item){
		item[0].bookmarks.push(bookmark);
		bookmark.save();



		console.log('Putting user bookmarks');
		User.update({_id: req.user._id}, {bookmarks: item[0].bookmarks}, {upsert: true}, function(err, item){
			res.send();
		});
	});
}

controller.signup = function(req, res){
	console.log('signing up...');
	var results = {};
	var status = 201;
	var taken = false;
	results.error = [];
	console.log(req.body.credentials);
	var userdetails = req.body.credentials;
	userdetails.createdon = new Date();
	
	var usernameTaken;
	var emailTaken;

	User.exists({username: req.body.credentials.username}).then(function(taken){
		console.log('this is the result of checking username existance: ' + taken);
		if(taken){
			usernameTaken = true;
			results.result += "This username has already been taken. ";
			results.error.push("This username has already been taken. ");
		}
	}).then(function(){

		User.exists({email: req.body.credentials.email}).then(function(taken){
		console.log('this is the result of checking email existance: ' + taken);
		if(taken){
			emailTaken = true;
			results.result += "This email has already been registered with an account";
			results.error.push("This email has already been taken. ");
		}
	}).then(function(){
		if(usernameTaken || emailTaken){
			console.log('username was taken')
			results.taken = true;
			res.status(201).send(results);
	}else{
		
	user = new User(userdetails);

	user.setPassword(req.body.credentials.password);
	user.save(function(err, result){
		if(err){
			console.log(err);
			console.log('there was an error with saving user');
			status = 201;
			results.status = status;
			results.result = result;
		}else{
			console.log('successfully saved user with unique ID');
			console.log(results);
			var date = new Date();
			console.log('bookmark created on' + date);

			var bookmark = new Bookmark({
				title: "These are your bookmarks",
				url: "http://www.sample.com",
				description: "Here's a sample of a bookmark. You can add as many bookmarks to your categories!",
				private: true,
				author: user._id,
				date: date
				});
				bookmark.save();

				var category = new Category({
				name: "Welcome",
				bookmarks: bookmark._id,
				owner: user._id
				});
				category.save();

				User.updateOne({_id: user._id}, {$push: {categories: category._id}}, function(error, success){
				if(err){
					console.log('couldnt save user');
					console.log(error)
				}else{
					user.save();
					console.log('Successfully Added Category to User');
				}
				
			});

		}

		res.status(status).send('completed saving user');
	})
				
	}
	})


	});
}


controller.signin = function(req, res){
	var results = {};
	results.status = 202;
	results.result = "";
	var username = req.body.credentials.username;
	console.log('this is what we received');
	console.log(req.body);
	var password = req.body.credentials.password;
	User.find({username: username}, function(err, item){
		if(err){
			res.status(201).send(err);
		}else{
			console.log('this is the user item');
			console.log(item);
			if(item[0] === undefined){
				console.log('could not find username in database');

				results.result = "Could not find your username";
				results.loggedin = false;
			}else{
				if(item[0].validatePassword(password)){
					console.log('found user');
					// var expirationDate = Math.floor ((new Date().getTime() + (60*60*48*1000))/1000);
					results.result = "Successfully logged in!";
					results.loggedin = true;
					var payload = {user: req.body.credentials.username};
					var options = {expiresIn: '2d'}
					var secret = process.env.JWT_SECRET;
					var token = jwt.sign(payload, secret, options);
					results.token = token;
					console.log('this is the token that was created: ');
					console.log(token);

					console.log('saving token entry with username');
					var dbToken = new Token({username: req.body.credentials.username, hashedToken: token});
					dbToken.save(function(error,result){
						if(err){
							console.log('there was an error adding token to db');
						}else{
							console.log('dbtoken and username saved successfully');
							console.log(result);
						}
					})	

				}else{

					results.result = "Wrong Password";
					results.loggedin = false;
				}
				
			}
			res.status(results.status).send(results);
		}
		
	
	}, function(err){
		if(err){
			results.result = err;
			results.status = 401;
			res.status(results.status).send('Could not find user');	
		}
	});
	
}



controller.authToken = function(req, res){
	console.log('this is the access token that was passed through');
	console.log(req.body);
	console.log(req.body.accessToken);
	Token.find({token: req.body.accessToken},function(err,item){
		if(err){
			console.log('there was an error with finding the access token');
			console.log(err);
			res.status(401).send({result: false});
		}else{
			console.log('this is the result of the search for the access token');
			console.log('token was found');
			console.log('return username');
			console.log(item);
			res.status(200).send({result: item});
		}
	})
}

controller.authTokenUpdate = function(req, res){
	console.log('this is the access token that was passed through');
	console.log(req.body);
	console.log('this is the username passed through');
	console.log(req.body.username);
	Token.updateOne({username: req.body.username}, {$set : {hashedToken: req.body.token}} ,function(err,item){
		if(err){
			console.log('there was an error with finding the access token');
			console.log(err);
			res.status(401).send({result: false});
		}else{
			console.log('this is the result of the update for the access token');
			console.log('here is the response');
			console.log(item);
			res.status(200).send({result: item});
		}
	})
}



controller.getUserObject = function(req, res){
	console.log('getting user DB ID by name');
	console.log(req.headers.username);
	User.find({username: req.headers.username}, function(err, item){

		console.log(err);
		console.log(item);
		if(err){
			console.log('There was an error when retrieving user db id by username');
			console.log(err);
			res.status(401).send(err);
		}else{
			console.log('user was found. returning object');
			console.log('this is the user item' + item);
			res.status(200).send(item);
		}
	})
}


controller.addBlurb = function(req, res){
	console.log('');
	console.log('attempting to add blurb');
	console.log(req.headers.bookmark);
	console.log('req.body.data' + req.headers.title);
	console.log(JSON.stringify(req.headers.bookmark))
	console.log('this is the user id being passed to addBlurb');
	console.log(req.headers.author);
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
		User.updateOne({_id: req.headers.author}, {$push: {bookmarks: bookmark._id}}, function(error, success){
			if(error){
				console.log(error)
				res.status(401).send(error);
			}else{
				console.log('Successfully Added');
				res.status(200).send(success);
			}
		} )
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




module.exports = controller;