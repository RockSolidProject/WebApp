var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'email' : String,
	'password' : String,
	'avatar' : String,
	'createdAt' : Date
});

module.exports = mongoose.model('user', userSchema);
