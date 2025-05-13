var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var climbingAreaSchema = new Schema({
	'name' : {
        'type' : String,
        'required' : true
    },
	'latitude' : {
        'type' : Number,
        'required': true
    },
	'longitude' : {
        'type' : Number,
        'required': true
    },
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user',
        default: "000000000000000000000000"
	},
    'dateTime' : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ClimbingArea', climbingAreaSchema);
