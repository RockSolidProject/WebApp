var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var routeClimbedSchema = new Schema({
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
	'attempts' : {
        type: Number,
        required: true    
    },
	'gradeOpinion' : {
        type: String,
        required: true
    },
    'dateTime' : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('routeClimbed', routeClimbedSchema);
