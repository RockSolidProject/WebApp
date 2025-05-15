var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var routeCommentSchema = new Schema({
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
	'content' : {
        type: String,
        required: true
    },
	'image' : String,
    'dateTime' : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('routeComment', routeCommentSchema);
