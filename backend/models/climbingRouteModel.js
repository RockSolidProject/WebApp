var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var climbingRouteSchema = new Schema({
	'name' : {
        'type' : String,
        'required' : true
    },
	'length' : {
        'type' : Number,
        'required': true
    },
	'type' : {
        type: String,
        required: true
    },
	'isVerified' : {
        type: Boolean,
        default: false
    },
    'climbingArea' : {
        type: Schema.Types.ObjectId,
	 	ref: 'climbingArea',
        required: true
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

module.exports = mongoose.model('ClimbingRoute', climbingRouteSchema);
