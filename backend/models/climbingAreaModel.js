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
    'dateTime' : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClimbingArea', climbingAreaSchema);
