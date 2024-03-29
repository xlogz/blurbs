var mongoose = require('mongoose');
var User = mongoose.model('User');
var Token = mongoose.model('Token');
var Bookmark = mongoose.model('Bookmark');
var jwt = require('jsonwebtoken');

var db = mongoose.connection;

var controller = function(){};

console.log('loading controller');

controller.validateToken = function(req, res){
	var results = {};
	results.status = 201;
	console.log(req.body);
	Token.find({token: req.body.authToken}).then(function(user){
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
	return User.find({_id: req.user._id}, function(err, item){
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
		
	user = new User(req.body.credentials);

	user.setPassword(req.body.credentials.password);
	user.save(function(err, result){
		if(err){
			console.log('there was an error with saving user');
			status = 201;
			results.status = status;
			results.result = result;
		}else{
			console.log('successfully saved user with unique ID');
			console.log(results);
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

module.exports = controller;