const mongoose = require('mongoose');
const Schema = mongoose.Schema

const activityLogSchema = new Schema({
    action: {
        type: String, //e.g., "create", "update", "delete"
        required: true
    },
    collectionName: {
        type: String, //The name of the collection being modified
        required: false
    },
    documentId: {
        type: Schema.Types.ObjectId, //The ID of the document being changed
        required: false
    },
    performedBy: {
        type: Schema.Types.Mixed, //The User who performed the action
        required: false
    },
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization", 
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now //When the action was performed
    },
    originalData: {
        type: Schema.Types.Mixed,//The original data(before the change), if applicable
        required: false
    },
    newData: {
        type: Schema.Types.Mixed, //The updated data(after the change), if applicable
        required: false
    },
    removedData: { //The removed(deleted) data, if applicable
        type: Schema.Types.Mixed,
        required: false
    }
})

module.exports = mongoose.model('ActivityLog', activityLogSchema);