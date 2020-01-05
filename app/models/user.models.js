var mongoose = require('mongoose');
var crypto = require('crypto');

var Schema = mongoose.Schema;

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
	}

});

UserSchema.methods.addBookmark = function(bookmark){
	this.bookmarks = this.bookmarks.push(bookmark);
}

module.exports = mongoose.model('User', UserSchema);
