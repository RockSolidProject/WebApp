var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var routeWishListSchema = new Schema({
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
});

module.exports = mongoose.model('routeWishList', routeWishListSchema);
