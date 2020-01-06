var mongoose = require('mongoose');
var User = mongoose.model('User');
var Bookmark = mongoose.model('Bookmark');
var Category = mongoose.model('Category');
var Token = mongoose.model('Token');

var request = require('request');



var db = mongoose.connection;

var controller = function(){};

console.log('loading controller');

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
	var credentials = {};
	credentials = req.body.credentials;

	console.log(req.body.credentials);
	credentials.categories = [];
	console.log('signing up...');

	console.log(req.body.credentials);
	var user = new User(req.body.credentials);



	


	user.save(function(err, results){
		if(err){
			console.log(err);
			return err;
		}else{
			console.log('successfully saved user');
			var bookmark = new Bookmark({
			title: "These are your bookmarks",
			url: "http://www.sample.com",
			description: "Here's a sample of a bookmark. You can add as many bookmarks to your categories!",
			private: true,
			author: user._id
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
				console.log(error)
			}else{
				console.log('Successfully Added Category to User');
			}
		} )

			user.save();



			console.log(results._id)
			console.log(results);
		}
		res.send(results);
	})

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



controller.getUserId = function(req, res){
	console.log('this is the token: ' + JSON.stringify(req));
	var options = {
		url: 'https://dev-kihm7h2g.auth0.com/userinfo',
		// headers: {Authorization: 'Bearer '+ 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlFUVTBRek15UlRFek56ZEJOREpDUWpaRFJUTkRNalV6UXpNeU1qRTVRVGswTnpJMU5rUTFOUSJ9.eyJpc3MiOiJodHRwczovL2Rldi1raWhtN2gyZy5hdXRoMC5jb20vIiwic3ViIjoiVGI3RFIzeFhMMFdFTVU4Y3FvSDBSUmhaSW13S0lCV21AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LWtpaG03aDJnLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNTc4MDE5MzM3LCJleHAiOjE1NzgxMDU3MzcsImF6cCI6IlRiN0RSM3hYTDBXRU1VOGNxb0gwUlJoWkltd0tJQldtIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBjcmVhdGU6dXNlcl90aWNrZXRzIHJlYWQ6Y2xpZW50cyB1cGRhdGU6Y2xpZW50cyBkZWxldGU6Y2xpZW50cyBjcmVhdGU6Y2xpZW50cyByZWFkOmNsaWVudF9rZXlzIHVwZGF0ZTpjbGllbnRfa2V5cyBkZWxldGU6Y2xpZW50X2tleXMgY3JlYXRlOmNsaWVudF9rZXlzIHJlYWQ6Y29ubmVjdGlvbnMgdXBkYXRlOmNvbm5lY3Rpb25zIGRlbGV0ZTpjb25uZWN0aW9ucyBjcmVhdGU6Y29ubmVjdGlvbnMgcmVhZDpyZXNvdXJjZV9zZXJ2ZXJzIHVwZGF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGRlbGV0ZTpyZXNvdXJjZV9zZXJ2ZXJzIGNyZWF0ZTpyZXNvdXJjZV9zZXJ2ZXJzIHJlYWQ6ZGV2aWNlX2NyZWRlbnRpYWxzIHVwZGF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgZGVsZXRlOmRldmljZV9jcmVkZW50aWFscyBjcmVhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIHJlYWQ6cnVsZXMgdXBkYXRlOnJ1bGVzIGRlbGV0ZTpydWxlcyBjcmVhdGU6cnVsZXMgcmVhZDpydWxlc19jb25maWdzIHVwZGF0ZTpydWxlc19jb25maWdzIGRlbGV0ZTpydWxlc19jb25maWdzIHJlYWQ6aG9va3MgdXBkYXRlOmhvb2tzIGRlbGV0ZTpob29rcyBjcmVhdGU6aG9va3MgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDp0ZW5hbnRfc2V0dGluZ3MgdXBkYXRlOnRlbmFudF9zZXR0aW5ncyByZWFkOmxvZ3MgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIHJlYWQ6bG9nX3N0cmVhbXMgY3JlYXRlOmxvZ19zdHJlYW1zIGRlbGV0ZTpsb2dfc3RyZWFtcyB1cGRhdGU6bG9nX3N0cmVhbXMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.EfwRUp0QLBbZ607OTq3zNeL1zbrE1C5Ch-Zdvdk7A8E9UZV-UzCiHbahLqQj15MBwW-WDMf6nCXkp2-BMgPNdjAHwTgBKXYd0JjPEkz1XqGKCnUScNd2Z0BBdUDlk0XPaDt5tEmuhmf8xyuSINY4iv1tWfpFpzHC6Y7XHxDTXchYI5hgobN2Vp5BUoBSG1Pbzs-meQpek_IXoG0p6_erdf0W1nNDUgkp8RwPPC59AeBLt3-oWc7SguGOTILxWW_Q20cRmhkExivvLwXTF4KNbm8BN4D3HQhoyBZTJxmpOxa2tRInJrsm5riPpK84aBRnIHJesQQ3CJ0pjKq3fm_JAA'}
		headers: {Authorization: 'Bearer ' + req.body.data}
	}
	request(options, function(error, response, body){
			console.log('this is the results of api call to get user info. token should have been issued');
			res.send(body);
		
	})
}



controller.getUserInfo = function(req, res){

	var tokenoptions = { method: 'POST',
	  url: 'https://dev-kihm7h2g.auth0.com/oauth/token',
	  headers: { 'content-type': 'application/json' },
	  body: '{"client_id":"T4Ml0iWLqoHlUYVAPc4UjnQevFWxOFgf","client_secret":"gMOcgRzAxRTS1iTxqNsh04jGr6iBJPef5IqVb1xvubMzdXahEt3R0h-qXnRpYK6l","audience":"https://dev-kihm7h2g.auth0.com/api/v2/","grant_type":"client_credentials"}' };

	request(tokenoptions, function (error, response, body) {
	  if (error){
	  	throw new Error(error);
	  	console.log('an error occured when receiving new token');
	  	console.log(error);
	  }else{
	  	var result;
	  	result = JSON.parse(body);
		var id = req.headers.data;

		id = 'user_id:' + '"' + id + '"';

		var options = {
			url: 'https://dev-kihm7h2g.auth0.com/api/v2/users',
			headers: {Authorization: 'Bearer ' + result.access_token}
			,qs: {q: id, search_engine: 'v3'}
			// headers: {Authorization: 'Bearer n36udzuAoHFypyr0eBuI8_2FtLHT71Iz'}
		}
		request(options, function(error, response, body){

				res.send(response.body);
			
		})
	  }
	  
	});
}

controller.getUserObject = function(req, res){
	console.log('getting user DB ID by name');
	console.log(req.headers.name);
	User.find({username: req.headers.name}, function(err, item){
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


// controller.addBlurb = function(req, res){
// 	console.log('');
// 	console.log('attempting to add blurb');
// 	console.log(req.headers);
// 	console.log(req.headers.bookmark);
// 	console.log('req.body.data' + req.headers.title);
// 	console.log(JSON.stringify(req.headers.bookmark))
// 	var bookmark = new Bookmark({
// 		_id: new mongoose.Types.ObjectId(),
// 		title: req.headers.title,
// 		url: req.headers.url,
// 		description: req.headers.description,
// 		private: req.headers.private,
// 		author: req.headers.author
// 	})

// 	bookmark.save(function(err, bookmark){
// 		if(err){
// 			console.log(err);
// 			res.status(201).send(err);
// 		}else{
// 			console.log('bookmark saved');


// 		}
// 	});

// 	User.findOneAndUpdate(
// 		{_id: req.headers.author},
// 		{$push: {bookmarks: bookmark}},
// 		function(error, success){
// 			if(error){
// 				console.log(error);
// 			}else{
// 				console.log(success);
// 			}
// 		}
// 	)

	
// }

module.exports = controller;