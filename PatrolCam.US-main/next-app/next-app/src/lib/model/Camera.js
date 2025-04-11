// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

import mongoose, { Schema } from "mongoose";

const cameraSchema = new Schema({
    camera_Name: {
        type : String, //The name of camera
        required: true
    },

    model: {
        type:String, //The camera model
        default: null
    },
    
    owner: {
        type: Schema.Types.ObjectId, //The organization that owns the camera
        ref: 'Organization',
        required: true
    },

    users: [{
        type: Schema.Types.ObjectId, //The users allowed to access it
        ref: 'User'
    }],

    location: {
        type:String, //The address of where the camera is located
        default: null,
        required: true
    },

    status: {
        type: String, //The status of camera eg: "Active" or "Inactive"
        default: "Inactive"
    }
});

const Camera = mongoose.model("Camera", cameraSchema) || mongoose.models.Camera; // Use existing model if it exists
export default Camera;

// module.exports = mongoose.model('Camera', cameraSchema);