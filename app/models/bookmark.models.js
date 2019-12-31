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
	link: {
		type: String,
		default:''
	},
	description: {
		type: String,
		default:''
	},
	relativelinks: {
		type: Array,
		default: []
	},
	children: {
		type: Number,
		default: 0
	}

})

module.exports = mongoose.model('Bookmark', BookMarkSchema);