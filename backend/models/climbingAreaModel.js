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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

climbingAreaSchema.virtual("routes",{
    ref: "climbingRoute",
    localField: "_id",
    foreignField: "climbingArea"
})

module.exports = mongoose.model('climbingArea', climbingAreaSchema);
