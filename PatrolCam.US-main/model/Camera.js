const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cameraSchema = new Schema({
    camera_Name: {
        type : String,
        required: true
    },

    model: {
        type:String,
        default: null
    },
    
    org_id: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    location: {
        type:String,
        default: null,
        required: true
    },

    status: {
        type: String,
        default: "Inactive"
    }
});

module.exports = mongoose.model('Camera', cameraSchema);