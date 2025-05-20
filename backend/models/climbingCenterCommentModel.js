var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var climbingCenterCommentSchema = new Schema({
    'climbingCenter': {
        type: Schema.Types.ObjectId,
        ref: 'climbingCenter',
        required: true
    },
    'postedBy': {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    'content': {
        type: String,
        required: true
    },
    'image': {
        type: String
    },
    'dateTime': {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('climbingCenterComment', climbingCenterCommentSchema);
