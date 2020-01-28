var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require("crypto");

var UserSchema = new Schema({
	firstname: {
		type: String,
		trim: true,
		default: '',
	},
	lastname: {
		type: String,
		trim: true,
		default: '',
	},
	location: {
		type: String,
		trim: true,
		default: '',
	},
	aboutme: {
		type: String,
		trim: true,
		default: ''
	},
	hash: String,
	salt: String,
	email: {
		type: String,
		trim: true,
		default: '',
	},
	username: {
		type: String,
		unique: 'testing error message',
		trim: true,
		default: '',
	},
	registeredUsername: {
		type: String,
		trim: true,
		default: '',
	},
	categories: [{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}],
	wall: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
	// categories: {type: Array,
	// 			name: String,
	// 			bookmarks: {type: Array,
	// 						id: {type: Schema.Types.ObjectId,
	// 							ref: 'Bookmark'}}
	// },
,
	friendsList:[{
		type: Schema.Types.ObjectId,
		ref: 'User'
		}],
	following:[{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	followedby:[{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	createdon : Date,
	reputation: Number,
	totalbookmarks: Number,
	notifications: Array

});

UserSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

UserSchema.methods.validatePassword = function(password){
	var hashCheck = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return hashCheck === this.hash;
}


module.exports = mongoose.model('User', UserSchema);
