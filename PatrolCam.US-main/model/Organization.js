const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    organizationName: {
        type : String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    organizationEmail: {
        type: String,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },

    cameras: [{
        type: Schema.Types.ObjectId,
        ref: 'Camera'
    }]
});

module.exports = mongoose.model('Organization', organizationSchema);