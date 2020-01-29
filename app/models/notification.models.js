var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	text: String,
	from: String,
	fromUsername: String,
	createdon: Date,
	viewed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Notification', NotificationSchema);