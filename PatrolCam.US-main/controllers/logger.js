const ActivityLog = require("../model/ActivityLog");

async function logNewUserCreation(userId, username, newUser){
    const log = new ActivityLog({
        action: 'create',
        collectionName: 'User',
        documentId: userId,
        performedBy: username,
        newData: newUser
    })
    await log.save()
}

async function logOrganizationCreation(organizationId, organizationOwner, newOrganization){
    const log = new ActivityLog({
        action: 'create',
        collectionName: 'Organization',
        documentId: organizationId,
        performedBy: organizationOwner,
        newData: newOrganization
    })
    await log.save()
}

async function logSubUserCreation(subUserId, createdBy, org_id, newSubUser){
    const log = new ActivityLog({
        action: 'create',
        collectionName: 'User',
        documentId: subUserId,
        performedBy: createdBy,
        organizationId: org_id,
        newData: newSubUser
    })
    await log.save()
}

async function logDeleteOrganizationUser(subUserId, deletedBy, org_Id){
    const log = new ActivityLog({
        action: 'delete',
        collectionName: 'User',
        documentId: subUserId,
        performedBy: deletedBy,
        organizationId: org_Id,
    })
    await log.save()
}

async function logPasswordReset(userId, org_Id, performedBy, originalData, newData){
    const log = new ActivityLog({
        action: 'update',
        collectionName: 'User',
        documentId: userId,
        performedBy: performedBy,
        organizationId: org_Id,
        originalData: originalData,
        newData: newData
    })
    await log.save()
}

module.exports = { logNewUserCreation, logOrganizationCreation, logSubUserCreation, logDeleteOrganizationUser, logPasswordReset}