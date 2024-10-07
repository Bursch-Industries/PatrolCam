const mongoose = require('mongoose');
const Schema = mongoose.Schema

const activityLogSchema = new Schema({
    action: {
        type: String, //e.g., "create", "update", "delete"
        required: true
    },
    collectionName: {
        type: String, //The name of the collection being modified
        required: true
    },
    documentId: {
        type: Schema.Types.ObjectId, //The ID of the document being changed
        required: true
    },
    performedBy: {
        type: String, //The User who performed the action
        required: true
    },
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization"
    },
    timestamp: {
        type: Date,
        default: Date.now //When the action was performed
    },
    originalData: {
        type: Schema.Types.Mixed //The original data(before the change), if applicable
    },
    newData: {
        type: Schema.Types.Mixed //The updated data(after the change), if applicable
    }
})

module.exports = mongoose.model('ActivityLog', activityLogSchema);