var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	comment: String,
	reply: [{
		type: Schema.Types.ObjectId, 
		ref: 'Comment'
	}],
	author: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	}
})

module.exports = mongoose.model('Comment', CommentSchema);