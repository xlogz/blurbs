var express = require('express');
var mongoose = require('mongoose');
var userModel = require('./app/models/bookmark.models.js');
var bookmarkModel = require('./app/models/user.models.js');
var tokenModel = require('./app/models/token.models.js');
var categoryModel = require('./app/models/category.models.js');
var commentModel = require('./app/models/comment.models.js');

var user = require('./app/controller/user.controller.js');
var blurb = require('./app/controller/blurb.controller.js');


var bodyParser = require('body-parser');
var dontenv = require('dotenv').config();


//connect to mongodb server
var db = mongoose.connect(process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/blurbs', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, function(err) {
	if (err) {
		console.error('Could not connect to MongoDB!');
		console.log(err);
	}
});

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', 
function(req, res) {
  res.render('index');
});


// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.text({ type: 'text/html' }))
app.use(bodyParser.text({ type: 'text/xml' }))
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.json({ type: 'application/*+json' }))

// function getUserBookmarks(req, res){
// 	return User.find({_id: req.user._id}, function(err, item){
// 		res.send(item[0].bookmarks);
// 	});
// }

// function putUserBookmark(req, res){
// 	var bookmark = new Bookmark(req.body);
// 	return User.find({_id: req.user._id}, function(err, item){
// 		item[0].bookmarks.push(bookmark);
// 		bookmark.save();
// 		User.update({_id: req.user._id}, {bookmarks: item[0].bookmarks}, {upsert: true}, function(err, item){
// 			res.send();
// 		});
// 	});
// }

//routes
// app.route('/users/bookmarks').get(user.getUserBookmarks);
// app.route('/users/bookmarks').put(user.putUserBookmark);

// var routes = require('./app/routes/routes.js')(app);

//setting port



var port = process.env.PORT || 3000

console.log('Bookmark is listening on ' + port);
app.listen(port);

var routes = require('./app/routes/routes.js')(app);