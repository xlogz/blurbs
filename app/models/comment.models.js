var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	text: String,
	reply: [{
		type: Schema.Types.ObjectId, 
		ref: 'Comment'
	}],
	author: {
		type: Schema.Types.ObjectId, 
		ref: 'User'
	},
	createdon: Date
})

module.exports = mongoose.model('Comment', CommentSchema);