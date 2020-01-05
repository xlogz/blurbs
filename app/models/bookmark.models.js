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
	children: {
		type: Number,
		default: 0
	},
	private: {
		type: Boolean,
		default: false
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}

})

module.exports = mongoose.model('Bookmark', BookMarkSchema);