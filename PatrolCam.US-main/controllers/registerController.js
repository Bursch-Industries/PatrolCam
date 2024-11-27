const User = require('../model/User'); //User schema
const Organization = require('../model/Organization'); //Organization schema
const Camera = require('../model/Camera'); //Camera schema
const bcrypt = require('bcrypt'); //For hashing passwords
const mongoose = require('mongoose');
const  { logActivity } = require('./logger'); //Used for logging activities
const { logError } = require('./errorLogger'); //Used for logging errors
const { withTransaction } = require('./transactionHandler') //Handles Database transaction

//Handles new user creation
async function handleNewUser (req, res) {
    const { password, userFirstname, userLastname, userEmail, phone, rank, role } = req.body;

    //Check missing request fields
    if (!password || !userFirstname || !userLastname || !userEmail){
        
        return res.status(400).json({ 'Error while creating new user': 'All required fields must be filled.' });
    }

    try {
        await withTransaction(async (session) => {
            //Encrypt the password
            const hashedPassword = await hashPassword(password);
            
            //Create and store the new user
            const newUser = new User({
                password: hashedPassword,
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: "Individual",
                phone: phone || 'N/A', //Optional
                rank: rank || 'N/A', //Optional
                roles: role
            });
            await newUser.save({ session });

            //Log user creation activity
            await logActivity({
                action: 'create',
                collectionName: 'User',
                documentId: newUser._id,
                performedBy: "System",
                newData: newUser,
                session
            });
        });

        //User creation success
        res.status(201).json({ 'User creation success': `New user ${userFirstname} created!` });
    } catch (error) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to create User',
                source: 'registerController - handleNewUser',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });

        //Server error
        res.status(500).json({ 'Error occured while creating user': error.message });
    }
}

//Handles new organization creation
async function handleNewOrganization (req, res) {
    const { orgName, orgEmail, orgPhone, orgAddress, orgCity, orgState, orgZip, password, userFirstname, userLastname, userEmail } = req.body;

    //Check missing request fields
    if (!orgName || !orgPhone || !orgAddress || !password || !orgEmail || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({ 
            'Error occured while creating new organization' : 'All required fields must be filled.'
        });
    }

    //Check for duplicate usernames in the database
    const organizationDuplicate = await Organization.findOne({ organizationName: orgName});

    if (organizationDuplicate) {
        return res.sendStatus(409) //Duplicate conflict
    } 

    try{
        await withTransaction(async (session) => {
            //Encrypt the password
            const hashedPassword = await hashPassword(password);

            //Create and store the owner of organization
            const owner = new User({
                password: hashedPassword,
                roles: 'Admin',
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: "N/A" //Null since we don't have organization id yet
            });
            await owner.save({ session });

            //Create and store organization
            const newOrgantization = new Organization({
                organizationName : orgName,
                owner: owner._id, //Attach owner id to keep track of creator
                organizationPhone: orgPhone,
                organizationAddress: {Address1: orgAddress, City: orgCity, State: orgState, ZipCode: orgZip}, 
                users: [owner._id], 
                organizationEmail: orgEmail,
            });

            await newOrgantization.save({ session });

            //Update the organization for the user
            await User.findByIdAndUpdate(owner, {organization: newOrgantization._id}, {session});

            //Log new user creation
            await logActivity({
                action: 'create',
                collectionName: 'User',
                documentId: owner._id,
                performedBy: 'System',
                organizationId: newOrgantization._id,
                newData: owner,
                session
            });

            //Log new organization creation
            await logActivity({
                action: 'create',
                collectionName: 'Organization',
                documentId: newOrgantization._id,
                performedBy: 'Master',
                newData: newOrgantization,
                session
            });
        });

        //Organization creation success
        res.status(201).json({ 'success': `New Organization ${orgName} created!`})
    } catch (error){

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to create Organization',
                source: 'registerController - handleNewOrganization',
                userId: 'Master',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });

        //server error
        res.status(500).json({ error: `Error occured while creating organization ${error.message}`});
    }
}

//Deletes user using user ID
async function deleteOrganizationUser (req, res) {
    const { userId } = req.body;

    //Check missing request fields
    if (!userId) return res.status(400).json({
        "Error occured while deleting user" : "All required fields must be filled."
    });

    const deletedBy = await User.findById(req.session.user.id);
    const userToDelete = await User.findById(userId);

    //Check if user or deletedBy is undefined
    if(!deletedBy || !userToDelete){
        return res.sendStatus(404) //User not found
    }

    //Check if both users are from the same organization and action performers role is Admin or AccountAdmin
    if(!deletedBy.organization.equals(userToDelete.organization) || (deletedBy.roles != "Admin" && deletedBy.roles != "AccountAdmin")){
        return res.sendStatus(403) //Access denied
    }

    try{
        await withTransaction(async (session) => {
            const originalData = await Organization.findById(deletedBy.organization)
            //Remove user from organization
            const newData = await Organization.findByIdAndUpdate(
                deletedBy.organization,
                { $pull: {users: userToDelete._id}},
                { new: true},
                session
            )

            await User.deleteOne({userToDelete}, {session})//locate user and delete

            //Log user deletion
            await logActivity({
                action: 'delete',
                collectionName: 'User',
                documentId: userToDelete._id,
                performedBy: deletedBy._id,
                organizationId: userToDelete.organization,
                removedData: userToDelete,
                session
            });

            //Log organization update
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: userToDelete.organization,
                performedBy: deletedBy._id,
                originalData: {
                    originalUsers: originalData.users
                },
                newData:{
                    updatedUsers : newData.users
                },
                session
            });
        });

        //Deletion success
        return res.status(200).json({"Deletion Confirmation" : `User ${userToDelete._id} deleted Successfully!`})

    } catch (error){

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to delete User',
                source: 'registerController - deleteOrganizationUser',
                userId: deletedBy._id,
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });
        //Server error
        return res.status(500).json({error : `Error occured while deleting user ${error.message}`})
    }
};

//User password reset
async function handlePasswordReset (req, res) {
    const { userId, newPwd } = req.body;

    //check missing request fields
    if (!userId || !newPwd) {
        return res.status(400).json({"Password Reset error" : "All required fields must be filled."});
    }

    const user = await User.findById(userId);

    if(!user){
        return res.sendStatus(404)
    }
    try{
        await withTransaction(async (session) => {
            const newHashedPwd = await hashPassword(newPwd);//Hash new password

            await User.findOneAndUpdate( //Update new password over in database
                {_id: userId},
                {password : newHashedPwd},
                {session}
            )

            //Log password reset
            await logActivity({
                action: 'update',
                collectionName: 'User',
                documentId: user._id,
                performedBy: user._id,
                originalData:{
                    originalPassword: user.password
                },
                newData: {
                    newPassword: newHashedPwd
                },
                session
            });
        });

        //Password reset success
        return res.status(200).json({"Password Reset Success" : `Password Reset for ${username} succcessfully!`})//success
    } catch (error){

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to reset password',
                source: 'registerController - handlePasswordReset',
                userId: 'System', // REPLACE with user id ?
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });

        //Server error
        return res.status(500).json({error : `Error occurred while reseting user password. ${error.message}`})
    }
};

//Adding new user into organization
async function handleAddNewOrgUser (req, res) {
    const {userPassword, userFirstname, userLastname, userEmail } = req.body;

    //Check missing request fields
    if(!userPassword || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({"Error occured while adding user to organization" : "All required fields must be filled."});
    }
 
    const creator = await User.findById(req.session.user.id);
    const organizationData = await Organization.findById(creator.organization);

    //If user wasn't found or access was denied
    if(error) {
        return res.status(error === "User not found" ? 404 : 403)
    }

    try{
        await withTransaction(async (session) => {
            //Hash user password
            const hashedPassword = await hashPassword(userPassword);

            //Create and store the subuser of organization
            const subUser = new User({
                password: hashedPassword,
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: organizationData._id,
                createdBy: creator._id
            });

            await subUser.save({ session })

            //Add the new sub user into the organization user list
            const updatedOrganization = await Organization.findByIdAndUpdate(
                organizationData._id,
                { $push:{ users: subUser._id}},
                { new: true, session}
            )
            await updatedOrganization.save({session})

            //If updating users list failed
            if(!updatedOrganization) {
                throw new Error ("Couldn't add user into organization");
            }

            //Log sub user creation
            await logActivity({
                action: 'create',
                collectionName: 'User',
                documentId: subUser._id,
                performedBy: creator._id,
                organizationId: organizationData._id,
                newData: subUser,
                session
            });

            //Log organization update
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: organizationData._id,
                performedBy: creator._id,
                originalData: {
                    originalUsers: organizationData.users
                },
                newData: {
                    updatedUsers: updatedOrganization.users
                },
                session
            });
        })

        //Successfully added new user
        return res.status(201).json({"Successfully added new user" : `New User has been added to Organization`});
    } catch(error) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to add User to Organization',
                source: 'registerController - handleAddNewOrgUser',
                userId: user,
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });
        //Server error
        return res.status(500).json({
            "Message" : "Error occured while adding organization user",
            "Erorr" : error.message
        });
    }
};

//Handles adding camera to organization
async function addCameraToOrganization(req, res) {
    const {camName, camModel, camLocation} = req.body;

    console.log('entering addCameraToOrganization: ' + JSON.stringify(req.body))

    //Check missing request fields
    if (!camName || !camModel || !camLocation){
        return res.status(400).json({"Error occured while adding camera to organization":"All required fields must be filled."})
    } 

    let user;
    let organizationData;


    if(req.session && req.session.user && req.session.user.id) {
        console.log('req.session.user.id found!!')
        user = await User.findById(req.session.user.id);
        console.log('user found: ' + user.organization)
        organizationData = await Organization.findById(user.organization);
        console.log('organization found: ' + JSON.stringify(organizationData._id));
    } else { 
        console.log('req.session.user.id NOT found');
        return res.sendStatus(404);
    }

    
    const owner = organizationData._id;
    const admin = user._id;
    console.log('before try block ' + owner + ' ' + admin)
    try{

        console.log('entering try block: ' + JSON.stringify(organizationData))
        await withTransaction(async (session) => {     
            //Create and store camera in database
            const newCamera = new Camera({
                camera_Name: camName,
                model: camModel,
                owner: owner,
                location: camLocation,
                users: [admin]
            });
            await newCamera.save({session});

            //Update the camera list in organization
            const updatedData = await Organization.findByIdAndUpdate(
                owner,
                { $push:{ cameras: newCamera._id}},
                { new: true}
            )
            await updatedData.save({session});

            //Check if the camera was added successfully
            if(!newCamera) {
                throw new Error(`Could not add camera to organization ${organizationData.organizationName}`)
            }
            //Log new camera creation
            await logActivity({
                action: 'create',
                collectionName: 'Camera',
                documentId: newCamera._id,
                organizationId: owner,
                performedBy: admin,
                newData: newCamera,
                session
            })

            //Log organization update
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: owner,
                performedBy: admin,
                originalData: {
                    originalCameras: organizationData.cameras
                },
                newData: {
                    updatedCameras: updatedData.cameras
                },
                session
            })
        })
        
        //Camera was created & added successfully
        return res.status(201).json({ 'Camera creation success': `New Camera: ${camName} created and added to organization!` });

    } catch(error) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to create new Camera',
                source: 'registerController - addCameraToOrganization',
                userId: admin,
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });
        //Server error
        return res.status(500).json({"Error occured while adding camera to organization:":error.message})
    }
}

async function findOrganizationForAdmin() {
    try {
        //Find the creator user
        const user = await findById(req.session.user.id);
        if(!user){
            return {error: 'User not found'}
        }

        //Check if user has "Creator" role
        if (user.roles != "Admin" && user.roles != "AccountAdmin") {
            return {error: 'Access Denied'} //Throw access denied error if user isn't authorized
        } 

        const userOrganization = await user.populate('organization')

        return {organizationData: userOrganization.organization, userData: user}

    } catch (error) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to find Organization Creator',
                source: 'registerController - findOrganizationCreator',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });

        return {error: `Error occured while searching for organization: ${error.message}`}
    }
};

//Hash passsword function
async function hashPassword (password) {
    try{
        hashedPwd = await bcrypt.hash(password, 10);
        return hashedPwd;
    }
    catch(error) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to hash password',
                source: 'registerController - hashPassword',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });

        throw new Error("Error occured while hashing password" + error.message)
    }
}

async function getCameraDetails(req, res) {

    if(!req.session || !req.session.user){
        return res.sendStatus(401);
    }

    try{
        
        const user = await User.findById(req.session.user.id);
        
        if(!user){
            return res.sendStatus(404)
        }

        const organization = await Organization.findById(user.organization._id).populate({
            path: 'cameras',
            select: '_id camera_Name location status'
        }).exec();

        if(!organization || !organization.cameras){
            return res.sendStatus(500);
        }

        if(organization.cameras.length === 0){
            return res.sendStatus(204)
        }

        return res.status(200).json({
            cameras: organization.cameras
        })
    } catch (error) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve Camera details',
                source: 'registerController - getCameraDetails',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });

        return res.status(500).json({ error: `Error occured while getting camera details: ${error.message}`})
    }
}

async function getOrgUserData(req, res) {


    if(!req.session || !req.session.user){
        console.log('req.session.user not found');
        return res.sendStatus(401);
    }

    const user = await User.findById(req.session.user.id);

    if(!user){
        console.log('ERROR: user not found');
        return res.sendStatus(401);
    }
    
    try{
        const orgUserArray = await getUserFields(req.session.org.id, ['firstname', 'lastname', 'email', 'lastLoggedIn', '-_id']) 
        return res.status(200).json({
            users: orgUserArray.users
        })
    } catch (error) {
        console.log(error.message)
        if(error.message === "404") return res.sendStatus(404)
        if(error.message === "403") return res.sendStatus(403)

        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve organization users',
                source: 'registerController - getOrgUsers',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });

        return res.status(500).json({'Error occured while getting user from organization' : error.message})
    } 
}

async function getUserLastLogin(req, res) {

    const { userId } = req.body

    try{
        const lastLoginArray = await getUserFields(req.session.org.id, ["firstname", "lastname", "lastLoggedIn", "-_id"])
        return res.status(200).json({
            message: 'Login history found',
            users: lastLoginArray.users
        })
    } catch (error) {
        if(error.message === "404") return res.sendStatus(404)
        if(error.message === "403") return res.sendStatus(403)

        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve login history of users in organization',
                source: 'registerController - getuserLastLogin',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });

        return res.status(500).json({'Error occured while getting user from organization' : error.message})
    }
}

async function getUserFields(orgId, fields = []) {

    const fieldSelection = fields.join(' ')
    const orgUserData = await Organization.findById(orgId)
        .populate({
            path: "users",
            select: fieldSelection
        })
        .lean()
        .exec()
    
    if(!orgUserData || !orgUserData.users || !orgUserData.users.length === 0) {
        throw new Error("404")
    }

    return orgUserData
}

async function getOrganizationDetails(req, res){
    if(!req.session || !req.session.user){
        return res.sendStatus(401);
    }

    const user = await User.findById(req.session.user.id);

    try{
        const orgDetails = await Organization.findById(user.organization);
        return res.status(200).json({
            organization: orgDetails
        })
    } catch (error) {
        if(error.message === "404") return res.sendStatus(404)
        if(error.message === "403") return res.sendStatus(403)

        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve organization detials',
                source: 'registerController - getOrganizationFields',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });

        return res.status(500).json({'Error occured while getting organization detials' : error.message})
    }
}

async function getOrganizationFields(){
    
    const {organizationData, error} = await findOrganizationForAdmin()

    if(error){
        throw new Error(error === "User not found" ? "404" : "403")
    }

    const orgFields = await Organization.findById(organizationData._id)
        .populate({
            path: "owner",
            select: "firstname lastname email roles -_id",
            model: 'User'
        })
        .select('organizationName organizationEmail organizationPhone organizationAddress -_id')
        .lean()
        .exec()
    
    if(!orgFields) {
        throw new Error("404")
    }
    
    return orgFields
}

//TODO: Test function and make sure it works
async function getOrganizationList(req, res){
    if(!req.session || !req.session.user){
        return res.sendStatus(401);
    }

    const username = req.session.user

    const user = await findUser(username)
    if(!user){
        return res.sendStatus(404)
    }

    try{
        const orgList = getAllOrganizations(user)
        return res.json(orgList) //Send the organization list as JSON

    } catch (error) {
        if(error.message === "403") return res.sendStatus(403)

        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve organization list',
                source: 'registerController - getOrganizationList',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });
    
        return res.status(500).json({'Error occured while getting organization list' : error.message})
    }
}

async function getAllOrganizations(user){
    if((user.roles).toLowerCase() !== 'master'){
        throw new Error("403") //Throw error if user is not authorized
    }

    const organizations = await Organization.find({})
    return organizations
}

// Function to log out all users of an organization that are currently logged in
async function deactivateOrg(req, orgId) {

    // Allows access to sessions without making a dedicated model since we are using mongo-connect
    let Session = mongoose.model('Session', new mongoose.Schema({}, { collection: 'sessions' }));
    try {
        let result = await Session.deleteMany({ org: {id: orgId }}); // Delete all sessions for given org
        console.log(`${result.deletedCount} documents were deleted.`);
        await logActivity({
            action: 'Organization Deactivation - ' + orgId,
            collectionName: 'sessions',
            performedBy: req.session.user.id
        })
    } catch (error) {
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to deactivate organization',
                source: 'deactivateOrg',
                userId: req.session.user ? req.session.user.id: 'unknown',
                code: 'ORG_DEACTIVATE_ERROR',
                meta: {error: error.message},
                session
            });
        });
        console.error('Error deleting documents:', error);
    }
}

async function updateOrganizationStatus(req, res){

    console.log('entering update org status')

    if(!req.session.user){
        return res.sendStatus(401)
    }

    const newStatus = req.body.status;
    const orgToUpdate = req.body.orgId;
    const originalStatus = Organization.findById(orgToUpdate).status;
    try{

        await withTransaction(async (session) => {
            await Organization.findByIdAndUpdate(
                orgToUpdate,
                {$set: {status: newStatus}},
                {new: true, session}
            )         
            if(newStatus == "Inactive") {
                await deactivateOrg(req, orgToUpdate);
            }
            await logActivity({
                action: 'Update Organization Status - ' + orgToUpdate,
                collectionName: 'organizations',
                originalData: originalStatus,
                newData: newStatus,
                performedBy: req.session.user.id
            })
        })

        return res.status(200).json({message: 'Success'})

    } catch (error){
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to update organization status',
                source: 'updateOrganizationStatus',
                userId: req.session.user ? req.session.user.id: 'unknown',
                code: 'ORG_UPDATE_ERROR',
                meta: {error: error.message},
                session
            });
        });

        res.status(500).json({message: 'Failed to update organization information', error: error.message})
    }
    
}

//TODO: Create update function to organization data
async function updateOrganizationInfo(req, res){

    if(!req.session.user){
        return res.sendStatus(401)
    }

    try{
        const updatedData = req.body

        await withTransaction(async (session) => {
            await Organization.findByIdAndUpdate(
                req.session.user.organizationId,
                {$set: updatedData},
                {new: true, session}
            )
        })

        return res.status(200).json({message: 'Organization information updated successfully'})

    } catch (error){
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to update organization information',
                source: 'updateOrganizationInfo',
                userId: req.session.user ? req.session.user.id: 'unknown',
                code: 'ORG_UPDATE_ERROR',
                meta: {error: error.message},
                session
            });
        });

        res.status(500).json({message: 'Failed to update organization information', error: error.message})
    } 
}

async function updateCameraInfo(req, res){

    if(!req.session.user){
        return res.sendStatus(401)
    }

    try{
        const {updatedInfo, cameraInfo} = req.body

        console.log(updatedInfo)
        console.log(cameraInfo)

        await withTransaction(async (session) => {
            await Camera.findByIdAndUpdate(
                cameraInfo,
                {$set: updatedInfo},
                {new: true, session}
            )
        })

        return res.status(200).json({message: 'Camera information updated successfully'})

    } catch (error){
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to update Camerea information',
                source: 'updateCameraInfo',
                userId: req.session.user ? req.session.user.id: 'unknown',
                code: 'ORG_UPDATE_ERROR',
                meta: {error: error.message},
                session
            });
        });

        res.status(500).json({message: 'Failed to update camera information', error: error.message})
    } 
}

module.exports = { 
    handleNewUser, 
    handleNewOrganization, 
    deleteOrganizationUser, 
    handlePasswordReset, 
    handleAddNewOrgUser, 
    addCameraToOrganization,
    getCameraDetails,
    getOrgUserData,
    getUserLastLogin,
    getOrganizationDetails,
    getOrganizationList,
    updateOrganizationInfo,
    updateOrganizationStatus,
    updateCameraInfo
};