var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	'email' : {
		type: String,
		required: true,
		trim: true
	},
	'password' : {
		type: String,
		required: true,
	},
	'avatar' : {
		type: String,
		required: true,
		default: '/images/default-avatar.png'
	},
	'dateTime' : {
		type: Date,
		required: true,
		default: Date.now
	}
});

module.exports = mongoose.model('user', userSchema);
