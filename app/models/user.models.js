var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
	},
	email: {
		type: String,
		trim: true,
		default: '',
	},
	username: {
		type: String,
		unique: 'testing error message',
		trim: true
	},
	bookmarks:{
		type: Array,
		default: []
	},
	friendsList:{
		type: Array,
		default: []
	}

});

module.exports = mongoose.model('User', UserSchema);
