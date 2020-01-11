var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CategorySchema = new Schema({
	name: String,
	bookmarks: [{
		type: Schema.Types.ObjectId, 
		ref: 'Bookmark'
	}],
	owner: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	}
})

module.exports = mongoose.model('Category', CategorySchema);