const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
    organizationName: {
        type : String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    roles: {
        User: {
            type: String,
            default: "Creator"
        },
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String
});

module.exports = mongoose.model('Organization', organizationSchema);