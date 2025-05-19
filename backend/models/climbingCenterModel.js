var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var climbingCenterSchema = new Schema({
	'name' : {
		type: String,
		required: true
	},
	'latitude' : {
		type: Number,
		required: true
	},
	'longitude' : {
		type: Number,
		required: true
	},
	'rating' : {
		type: Number,
		default: 0
	},
	'owner' : {
	 	type: Schema.Types.ObjectId,
		required: true,
	 	ref: 'user'
	},
	'hasBoulders' : {
		type: Boolean,
		default: false
	},
	'hasRoutes' : {
		type: Boolean,
		default: false
	},
	'hasMoonboard' : {
		type: Boolean,
		default: false
	},
	'hasSprayWall' : {
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('climbingCenter', climbingCenterSchema);
