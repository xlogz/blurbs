var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require("crypto");

var TokenSchema = new Schema({

	username: {
		type: String,
		unique: 'testing error message',
		trim: true,
		default: '',
	},
	token: String,
	userid: String,
	hashedToken: String,
	expires: Date,
	salt: String
});

TokenSchema.methods.setHash = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hashedToken = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

TokenSchema.methods.validateHash = function(password){
	var hashCheck = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
	return hashCheck === this.hashedToken;
}


module.exports = mongoose.model('Token', TokenSchema);
