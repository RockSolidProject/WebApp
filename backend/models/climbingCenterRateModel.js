var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var climbingCenterRateSchema = new Schema({
	'climbingCenter' : {
	 	type: Schema.Types.ObjectId,
		required: true,
	 	ref: 'climbingCenter'
	},
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
		required: true,
	 	ref: 'user'
	},
	'rating' : {
		type: Number,
		required: true,
	},
	'dateTime' : {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('climbingCenterRate', climbingCenterRateSchema);
