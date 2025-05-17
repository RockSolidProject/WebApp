var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var eventSchema = new Schema({
	'climbingAreas' : [{
		type: Schema.Types.ObjectId,
		ref: 'climbingArea'
	}],
	'climbingCenters' : [{
		type: Schema.Types.ObjectId,
		ref: 'climbingCenter'
	}],
	'groups' : [{
		type: Schema.Types.ObjectId,
		ref: 'group'
	}],
	'name' : {
		type: String,
		required: true
	},
	'description' : String,
	'date' : {
		type: Date,
		required: true
	},
	'photo' : String
});

module.exports = mongoose.model('event', eventSchema);
