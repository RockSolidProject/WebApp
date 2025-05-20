var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var routeRateSchema = new Schema({
    'climbingRoute' : {
        type: Schema.Types.ObjectId,
	 	ref: 'climbingRoute',
        required: true
    },
    'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user',
        default: "000000000000000000000000"
	},
	'rating' : {
        type: Number,
        required: true
    },
    'dateTime' : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('routeRate', routeRateSchema);
