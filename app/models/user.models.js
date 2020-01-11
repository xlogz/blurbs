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
	categories: [{
		type: Schema.Types.ObjectId,
		ref: 'Category'
	}],
	// categories: {type: Array,
	// 			name: String,
	// 			bookmarks: {type: Array,
	// 						id: {type: Schema.Types.ObjectId,
	// 							ref: 'Bookmark'}}
	// },

	friendsList:{
		type: Array,
		default: []
	},
	createdon : Date

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
