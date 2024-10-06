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
        type: String,
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
        required: false,
        default: null
    },
    refreshToken: String,

    organization: {
        type: Schema.Types.ObjectId,
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
        ref:'User'
    },

    status: {
        type: String,
        default: "Active"
    }
});

module.exports = mongoose.model('User', userSchema);