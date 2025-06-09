var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var groupSchema = new Schema({
    'name': {
        type: String,
        required: true
    },
    'isPrivate': {
        type: Boolean,
        required: true
    },
    'owner': {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    'description': String,
    'image': String
});

module.exports = mongoose.model('group', groupSchema);
