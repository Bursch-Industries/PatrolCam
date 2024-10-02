const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    roles: {
        type: String,
        default: "User"
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: String,

    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    }
});

module.exports = mongoose.model('User', userSchema);