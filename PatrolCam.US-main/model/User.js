const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
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
        default: null
    },
    phone: {
        type: String,
        required: false,
        default: null
    },
    rank: {
        type: String,
    },
    refreshToken: String,

    organization: {
        type: Schema.Types.ObjectId, //Which organization the user is in
        ref: 'Organization'
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
        type:Schema.Types.ObjectId,
        ref:'User',
        default: null
    },

    status: {
        type: String,
        default: "Active"
    }
});

module.exports = mongoose.model('User', userSchema);