var express = require('express');
var mongoose = require('mongoose');

var userModel = require('./app/models/bookmark.models.js');
var bookmarkModel = require('./app/models/user.models.js');
var tokenModel = require('./app/models/token.models.js');
var categoryModel = require('./app/models/category.models.js');
var emailModel = require('./app/models/email.models.js')

var user = require('./app/controller/user.controller.js');
var blurb = require('./app/controller/blurb.controller.js');

var bodyParser = require('body-parser');
var dotenv = require('dotenv').config();


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

app.route('/blurb/category').put(blurb.addCategory);
app.route('/blurb/bookmark/add').put(blurb.addBlurb);
app.route('/blurb/bookmark/remove').put(blurb.deleteBlurb);
app.route('/blurb/myblurbs').get(blurb.myBlurbs);
app.route('/blurb/mycategories').get(blurb.myCategories);

app.route('/get/userId').put(user.getUserId);
app.route('/get/userInfo').put(user.getUserInfo);
// app.route('/get/test').put(user.getTest);
app.route('/users/bookmarks').get(user.getUserBookmarks);
app.route('/users/bookmarks').put(user.putUserBookmark);

app.route('/users/signup').put(user.signup);
app.route('/users/authtoken').put(user.authToken);


app.route('/users/userObject').get(user.getUserObject);


app.get('/*',function (req, res) {
        res.render('index');
    });