const User = require('../model/User'); //User schema
const Organization = require('../model/Organization'); //Organization schema
const Camera = require('../model/Camera'); //Camera schema
const bcrypt = require('bcrypt'); //For hashing passwords
const  { logActivity } = require('./logger'); //Used for logging activities
const { logError } = require('./errorLogger'); //Used for logging errors
const { withTransaction } = require('./transactionHandler') //Handles Database transaction

//Handles new user creation
async function handleNewUser (req, res) {
    const { user, password, userFirstname, userLastname, userEmail, phone, rank } = req.body;

    //Check missing request fields
    if (!user || !password || !userFirstname || !userLastname || !userEmail){
        // REPLACE with client-side js validation ?
        return res.status(400).json({ 'Error while creating new user': 'All required fields must be filled.' });
    }

    //Check for duplicate usernames in the db
    const duplicate = await findUser(user)
    if (duplicate) {
        return res.sendStatus(409) //Duplicate conflict 
    }

    try {
        await withTransaction(async (session) => {
            //Encrypt the password
            const hashedPassword = await hashPassword(password);
            
            //Create and store the new user
            const newUser = new User({
                username: user,
                password: hashedPassword,
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: "Individual",
                phone: phone || 'N/A', //Optional
                rank: rank || 'N/A' //Optional
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
        res.status(201).json({ 'User creation success': `New user ${user} created!` });
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
    const { orgName, orgEmail, orgPhone, orgAddress, user, password, userFirstname, userLastname, userEmail } = req.body;

    //Check missing request fields
    if (!orgName || !orgPhone || !orgAddress || !user || !password || !orgEmail || !userFirstname || !userLastname || !userEmail) {
        // REPLACE with client-side js for validation ?
        return res.status(400).json({ 
            'Error occured while creating new organization' : 'All required fields must be filled.'
        });
    }

    //Check for duplicate usernames in the database
    const organizationDuplicate = await Organization.findOne({ organizationName: orgName}).exec();
    const userDuplicate = await findUser(user)

    if (organizationDuplicate || userDuplicate) {
        return res.sendStatus(409) //Duplicate conflict
    } 

    try{
        await withTransaction(async (session) => {
            //Encrypt the password
            const hashedPassword = await hashPassword(password);

            //Create and store the owner of organization
            const owner = new User({
                username: user,
                password: hashedPassword,
                roles: 'Creator',
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: null //Null since we don't have organization id yet
            });
            await owner.save({ session });

            //Create and store organization
            const newOrgantization = new Organization({
                organizationName : orgName,
                owner: owner._id, //Attach owner id to keep track of creator
                organizationPhone: orgPhone,
                organizationAddress: orgAddress,
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

//Deletes user using username
async function deleteOrganizationUser (req, res) {
    const { username, admin } = req.body;

    //Check missing request fields
    // REPLACE with client-side js validation ?
    if (!username || !admin) return res.status(400).json({
        "Error occured while deleting user" : "All required fields must be filled."
    });

    //Check if both users are from the same organization and action performers role is set to creator
    if(!deletedBy.organization.equals(user.organization) || !checkUserRole(deletedBy)){
        return res.sendStatus(403) //Access denied
    }

    const deletedBy = await findUser(admin)
    const user = await findUser(username)

    //Check if user or deletedBy is undefined
    if(!deletedBy || !user){
        return res.sendStatus(404) //User not found
    }

    try{
        await withTransaction(async (session) => {
            const originalData = await Organization.findById(deletedBy.organization)
            //Remove user from organization
            const newData = await Organization.findByIdAndUpdate(
                deletedBy.organization,
                { $pull: {users: user._id}},
                { new: true},
                session
            )

            await User.deleteOne({username}, {session})//locate username and delete

            //Log user deletion
            await logActivity({
                action: 'delete',
                collectionName: 'User',
                documentId: user._id,
                performedBy: deletedBy._id,
                organizationId: user.organization,
                removedData: user,
                session
            });

            //Log organization update
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: user.organization,
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
        return res.status(200).json({"Deletion Confirmation" : `User ${username} deleted Successfully!`})

    } catch (error){

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to delete User',
                source: 'registerController - deleteOrganizationUser',
                userId: deletedBy,
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
    const { username, newPwd } = req.body;

    //check missing request fields
    // REPLACE with client-side js validation ?
    if (!username || !newPwd) {
        return res.status(400).json({"Password Reset error" : "All required fields must be filled."});
    }

    const user = await findUser(username);//Find user by username

    if(!user){
        return res.sendStatus(404)
    }
    try{
        await withTransaction(async (session) => {
            const newHashedPwd = await hashPassword(newPwd);//Hash new password

            await User.findOneAndUpdate( //Update new password over in database
                {username},
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
    const {creator, user, userPassword, userFirstname, userLastname, userEmail } = req.body;

    //Check missing request fields
    // REPLACE with client-side js validation ?
    if(!creator || !user || !userPassword || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({"Error occured while adding user to organization" : "All required fields must be filled."});
    }

    //Check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.sendStatus(409) //Duplicate conflict 
    } 

    //Find and store organization and user data based on username
    const {organizationData, userData, error} = await findOrganizationForAdmin(creator);

    //If user wasn't found or access was denied
    if(error) {
        return res.sendStatus(error === "User not found" ? 404 : 403)
    }

    try{
        await withTransaction(async (session) => {
            //Hash user password
            const hashedPassword = await hashPassword(userPassword);

            //Create and store the subuser of organization
            const subUser = new User({
                username: user,
                password: hashedPassword,
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: organizationData._id,
                createdBy: userData._id
            });

            await subUser.save({ session })

            //Add the new sub user into the organization user list
            const updatedOrganization = await Organization.findByIdAndUpdate(
                organizationData._id,
                { $push:{ users: subUser.id}},
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
                performedBy: userData._id,
                organizationId: organizationData._id,
                newData: subUser,
                session
            });

            //Log organization update
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: organizationData._id,
                performedBy: userData._id,
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
    const {camName, username, camModel, camLocation} = req.body;

    //Check missing request fields
    // REPLACE with client-side js validation ?
    if (!camName || !username || !camModel || !camLocation){
        return res.status(400).json({"Error occured while adding camera to organization":"All required fields must be filled."})
    } 

    //Find and store organization and user data based on username
    const {organizationData, userData, error} = await findOrganizationForAdmin(username)

    //If user wasn't found or access was denied
    if(error) {
        return res.sendStatus(error === "User not found" ? 404 : 403)
    }

    try{
        await withTransaction(async (session) => {     
            //Create and store camera in database
            const newCamera = new Camera({
                camera_Name: camName,
                model:camModel,
                owner: organizationData._id,
                location: camLocation,
                users: [userData._id]
            });
            await newCamera.save({session});

            //Update the camera list in organization
            const updatedData = await Organization.findByIdAndUpdate(
                organizationData._id,
                { $push:{ cameras: newCamera.id}},
                { new: true}
            )
            await updatedData.save({session});

            //Check if the camera was added successfully
            if(!newCamera) {
                throw new Error(`Couldnot add camera to organization ${organizationData.organizationName}`)
            }
            //Log new camera creation
            await logActivity({
                action: 'create',
                collectionName: 'Camera',
                documentId: newCamera._id,
                organizationId: organizationData._id,
                performedBy: userData._id,
                newData: newCamera,
                session
            })

            //Log organization update
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: organizationData._id,
                performedBy: userData._id,
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
                userId: userData.username,
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });
        //Server error
        return res.status(500).json({"Error occured while adding camera to organization:":error.message})
    }
}

async function findOrganizationForAdmin(username) {
    try {
        //Find the creator user
        const user = await findUser(username);
        if(!user){
            return {error: 'User not found'}
        }

        //Check if user has "Creator" role
        const isAdmin = checkUserRole(user) //Checks user authorization
        if (!isAdmin) {
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

//Check if the user role is "Creator"
function checkUserRole(user){
    if (!user || !user.roles) {
        return false //Return false if user or roles are not defined
    }

    //Case insensitive check for string roles
    return user.roles.toLowerCase() === "creator" || user.roles.toLowerCase() === "admin"
}

//Finds user using username
async function findUser(username){
    const user = await User.findOne({username:username}) //Locate user
    if(!user) return false
    return user //Return result
}

async function getCameraDetails(req, res) {
    const { username } = req.body;

    if(!username){
        return res.status(400).json({"Error occured while getting camera details": "All fields are required"})
    }

    try{
        const user = await findUser(username)
        
        if(!user){
            return res.sendStatus(404)
        }

        const organization = await Organization.findById(user.organization._id).populate({
            path: 'cameras',
            select: 'camera_Name location status'
        }).exec();

        if(!organization || !organization.cameras || !organization.cameras.length === 0){
            return res.sendStatus(404)
        }

        return res.status(200).json({
            message: `Cameras found for user ${username}`,
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
    const { username } = req.body

    try{
        const orgUserArray = await getUserFields(username, ['firstname', 'lastname']) 
        return res.status(200).json({
            message: `Users found for user ${username}`,
            users: orgUserArray.users
        })
    } catch (error) {
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
    const { username } = req.body

    try{
        const lastLoginArray = await getUserFields(username, ["lastLoggedIn"])
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

async function getUserFields(username, fields = []) {
    if(!username){
        throw new Error("All fields are required")
    }
    const {organizationData, error} = await findOrganizationForAdmin(username)

    if(error){
        throw new Error(error === "User not found" ? "404" : "403")
    }

    const fieldSelection = fields.join(' ')
    const orgUserData = await Organization.findById(organizationData._id)
        .populate({
            path: "users",
            select: fieldSelection
        }).exec()
    
    if(!orgUserData || !orgUserData.users || !orgUserData.users.length === 0) {
        throw new Error("404")
    }

    return orgUserData
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
    getUserLastLogin
};