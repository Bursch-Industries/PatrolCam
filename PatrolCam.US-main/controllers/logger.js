const ActivityLog = require("../model/ActivityLog");

async function logActivity({
    action,
    collectionName,
    documentId,
    performedBy,
    organizationId = null,
    originalData = null,
    newData = null,
    removedData = null,
    session = null //Added session for transaction
}) {
    try{
        const log = new ActivityLog({
            action,
            collectionName,
            documentId,
            performedBy,
            organizationId,
            originalData,
            newData,
            removedData
        })

        //Save the log with or without session
        if(session){
            await log.save({ session })
        } else {
            await log.save()
        }
    } catch (error){
        throw new Error(`Error occured while logging ${action} on ${collectionName}: ${error.message}`)
    }
}



module.exports = { logActivity }