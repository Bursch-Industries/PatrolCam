const ActivityLog = require("../model/ActivityLog");

//handles activity logs for new user creation
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

//handles activity logs for new organization creation
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

//handles activity logs for new sub user creation for organization
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

//handles activity logs for deletion of user from organization
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

//handles activity logs for user password resets
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