var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var climbingAreaSchema = new Schema({
	'name' : String,
	'latitude' : Number,
	'longitude' : Number,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
    'dataTime' : Date
});

module.exports = mongoose.model('climbingArea', climbingAreaSchema);
