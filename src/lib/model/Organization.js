// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

import mongoose, { Schema } from "mongoose";

const organizationSchema = new Schema({
    organizationName: {
        type : String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId, //Owner of the organization
        ref: 'User',
        required: true
    },
    organizationEmail: {
        type: String,
        required: true
    },
    organizationPhone: {
        type: String,
        required: true
    },
    organizationAddress: {
            Address1: {
                type: String
            },
            City: {
                type: String
            },
            State: {
                type: String
            },
            ZipCode: {
                type: String
            }
    },
    users: [{ 
        type: Schema.Types.ObjectId, //Collection of users in organization
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },

    cameras: [{
        type: Schema.Types.ObjectId, //Collection of cameras owned by organization
        ref: 'Camera'
    }],
    
    status: {
        type: String,
        default: "Active"
    }
});


const Organization = mongoose.models.Organization || mongoose.model("Organization" , organizationSchema);
export default Organization;

// module.exports = mongoose.model('Organization', organizationSchema);