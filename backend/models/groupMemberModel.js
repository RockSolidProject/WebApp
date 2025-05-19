var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var groupMemberSchema = new Schema({
	'group' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'group',
		required: true
	},
	'member' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user',
		required: true
	}
});

module.exports = mongoose.model('groupMember', groupMemberSchema);
