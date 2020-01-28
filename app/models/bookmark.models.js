var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BookMarkSchema = new Schema({
	title: {
		type: String,
		default:''
	},
	url: {
		type: String,
		default:''
	},
	description: {
		type: String,
		default:''
	},
	relativelinks: [{
		type: Schema.Types.ObjectId, 
		ref: 'Bookmark'
	}],
	depth: {
		type: Number,
	},
	private: {
		type: Boolean,
		default: false
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	createdon: {
		type: Date,
	},
	tags : [{
		type: String
	}]

})



module.exports = mongoose.model('Bookmark', BookMarkSchema);