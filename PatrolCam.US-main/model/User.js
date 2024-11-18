const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    roles: {
        type: String, //Eg: "Creator", "Admin", "User"
        default: "User",
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    rank: {
        type: String,
    },
    refreshToken: String,

    organization: { //Which organization the user is in
        type: Schema.Types.Mixed, 
        ref: 'Organization',
        required: true
    },

    lastLoggedIn: {
        type: Date,
        default: Date.now
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    createdBy: {
        type:Schema.Types.Mixed,
        default: "System"
    },

    rememberMe: {
        type: String
    },

    status: {
        type: String,
        default: "Active"
    }
});

module.exports = mongoose.model('User', userSchema);