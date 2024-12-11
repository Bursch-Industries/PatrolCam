const User = require('../model/User'); //User schema
const Organization = require('../model/Organization'); //Organization schema
const Camera = require('../model/Camera'); //Camera schema
const bcrypt = require('bcrypt'); //For hashing passwords
const mongoose = require('mongoose');
const  { logActivity } = require('./logger'); //Used for logging activities
const { logError } = require('./errorLogger'); //Used for logging errors
const { withTransaction } = require('./transactionHandler') //Handles Database transaction

/**
 * Handles the creation of user in system.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with status of user creation.
 */
async function handleNewUser (req, res) {
    //Ensure that request is coming from AccountAdmin
    if(!req.session || !req.session.user || !req.session.user.role === "AccountAdmin"){
        return res.sendStatus(401);
    }

    const { password, userFirstname, userLastname, userEmail, phone, rank, role } = req.body;

    //Validate required fields
    if (!password || !userFirstname || !userLastname || !userEmail){
        
        return res.status(400).json({ 'Error while creating new user': 'All required fields(userFirstname, userLastname, userEmail, password) must be filled.' });
    }

    //Check for duplicate users in the database
    const duplicate = await User.findOne({email:userEmail}) //Locate user by email
    if (duplicate) {
        return res.sendStatus(409).send({error: 'A user with this email already exists.'}); //Duplicate conflict error
    }

    try {
        //Begin database transaction
        await withTransaction(async (session) => {
            //Hash the password for security
            const hashedPassword = await hashPassword(password);
            
            //Create a new user document
            const newUser = new User({
                password: hashedPassword,
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: "Individual", //Default organization
                phone: phone || 'N/A', //Optional field with default value
                rank: rank || 'N/A', //Optional field with default value
                roles: role //User role
            });

            //Save the new user to database within the transaction
            await newUser.save({ session });

            //Log the user creation activity for auditing
            await logActivity({
                action: 'create',
                collectionName: 'User',
                documentId: newUser._id,
                performedBy: "System",
                newData: newUser,
                session
            });
        });

        //Send a success response to client
        res.status(201).json({ 'User creation success': `New user ${userEmail} created successfully!` });
    } catch (error) {
        //Handle errors during the creation process
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

        //Respond with a server error
        res.status(500).json({ 
            error: 'Error occured while creating user',
            details: error.message
        });
    }
}

/**
 * Handles the creation of new organization along with its owner.
 * 
 * @param {Object} req - The HTTP request object containing organization and owner details.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Responds with status of organization creation process.
 */
async function handleNewOrganization (req, res) {
    //Ensure that request is coming from AccountAdmin
    if(!req.session || !req.session.user || !req.session.user.role === "AccountAdmin"){
        return res.sendStatus(401);
    }

    const { orgName, orgEmail, orgPhone, orgAddress, orgCity, orgState, orgZip, password, userFirstname, userLastname, userEmail } = req.body;

    //Validate required fields
    if (!orgName || !orgPhone || !orgAddress || !password || !orgEmail || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({ 
            'Error occured while creating new organization' : 'All required fields(organization and owner details) must be filled.'
        });
    }

    //Check for duplicate organization names in the database
    const organizationDuplicate = await Organization.findOne({ organizationName: orgName}).exec();
    const userDuplicate = await User.findOne({email: userEmail})

    //Duplicate conflict error if organization name or user already exists in database
    if (organizationDuplicate || userDuplicate) {
        return res.sendStatus(409).send({error: 'An Organization with this name or user with this email already exists.'}); 
    } 

    try{
        //Begin database transaction
        await withTransaction(async (session) => {
            //Hash the password for security
            const hashedPassword = await hashPassword(password);

            //Create the owner of organization
            const owner = new User({
                firstname: userFirstname,
                lastname: userLastname,
                password: hashedPassword,
                email: userEmail,
                roles: 'Admin', //Default role for owner
                organization: "N/A" //Initially set to 'N/A' since organization ID isn't available yet
            });

            //Save the owner to database within the transaction
            await owner.save({ session });

            //Create the organization
            const newOrgantization = new Organization({
                organizationName : orgName,
                owner: owner._id,
                organizationPhone: orgPhone,
                organizationAddress: { //Structured address data
                    Address1: orgAddress, 
                    City: orgCity, 
                    State: orgState,
                    ZipCode: orgZip
                }, 
                users: [owner._id],
                organizationEmail: orgEmail,
            });

            //Save the organization to database with the transaction
            await newOrgantization.save({ session });

            //Update the organization ID for the owner
            await User.findByIdAndUpdate(
                owner,
                {organization: newOrgantization._id},
                {session}
            );

            //Log the creation of new user(owner)
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
                performedBy: 'AccountAdmin',
                newData: newOrgantization,
                session
            });
        });

        //Respond with success message
        res.status(201).json({ 'success': `New Organization ${orgName} created!`})
    } catch (error){
        //Handle errors during the organization creation process
        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR', 
                desc: 'Failed to create Organization', 
                source: 'registerController - handleNewOrganization',
                userId: 'AccountAdmin',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });

        //server error
        res.status(500).json({ error: `Error occured while creating organization ${error.message}`});
    }
}

/**
 * Deletes a user from an organization using their userId.
 * 
 * @param {Object} req - The HTTP request object containing the userId of the user to delete.
 * @param {Object} res - The HTTP response object. 
 * @returns {Promise<void>} Responds with the status of the deletion process.
 */
async function deleteOrganizationUser (req, res) {
    //Ensure that request is coming from a logged in user
    if(!req.session || !req.session.user){
        return res.sendStatus(401);
    }

    //Extract the userId of the user to be deleted from the request body
    const { userId } = req.body;

    //Validate that the required fields (userId) is provided
    if (!userId || !req.session.user || !req.session.user.id) {
        return res.status(400).json({
            "Error occured while deleting user" : "All required fields must be filled."
        });
    }
    
    //Retrieve details of the user performing the action(deletedBy) and user to be deleted
    const deletedBy = await User.findById(req.session.user.id);
    const userToDelete = await User.findById(userId);

    //Check if either the aciton performer or the target user does not exist
    if(!deletedBy || !userToDelete){
        return res.sendStatus(404) //User not found
    }

    //Ensure the users belong to the same organization, and the action performer has the required role
    if(
        !deletedBy.organization.equals(userToDelete.organization) || 
        (deletedBy.roles !== "Admin" || deletedBy.roles !== "AccountAdmin")
    ) {
        return res.sendStatus(403) //Access denied
    }

    try{
        //Begin a database transaction
        await withTransaction(async (session) => {
            //Retrieve the organization's original data (before deletion)
            const originalData = await Organization.findById(deletedBy.organization)

            //Remove the user from the organization's users array
            const newData = await Organization.findByIdAndUpdate(
                deletedBy.organization,
                { $pull: {users: userToDelete._id}},
                { new: true},
                session
            )

            //Delete the user from the database
            await User.deleteOne({_id: userToDelete._id}, {session})

            //Log the deletion of the user
            await logActivity({
                action: 'delete',
                collectionName: 'User',
                documentId: userToDelete._id,
                performedBy: deletedBy._id,
                organizationId: userToDelete.organization,
                removedData: userToDelete,
                session
            });

            //Log the update to the organization (user removed)
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

        //Respond with success message upon deletion
        return res.status(200).json({"Deletion Confirmation" : `User ${userToDelete._id} deleted Successfully!`})

    } catch (error){
        //Handle errors that occur during the deletion process
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
        //Respond with a server error
        return res.status(500).json({error : `Error occured while deleting user ${error.message}`})
    }
};

/**
 * Handles the password reset process for a logged-in user.
 * 
 * @param {Object} req - The HTTP request object containing session details and the new password.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Responds with the status of the password reset process.
 */
async function handlePasswordReset (req, res) {
    //Extract the new password from the request body
    const { newPwd } = req.body;

    //Check missing request fields
    if (!req.session || !req.session.user || !newPwd) {
        return res.status(400).json({"Password Reset error" : "All required fields must be filled."});
    }

    //Retrieve the user based on the session ID
    const user = await User.findById(req.session.user.id);

    //If user does not exist, return a 404 Not Found status
    if(!user){
        return res.sendStatus(404)
    }

    try{
        //Begin a database transaction
        await withTransaction(async (session) => {
            //Hash the new passwod
            const newHashedPwd = await hashPassword(newPwd);

            //Update the user's password in the database
            await User.findOneAndUpdate( 
                {_id: req.session.user.id},
                {password : newHashedPwd},
                {session}
            )

            //Log the password reset activity for auditing purposes
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

        //Repsond with success message upon successful password reset
        return res.status(200).json({"Password Reset Success" : `Password Reset for ${username} succcessfully!`})
    } catch (error){
        //Handle errors that occur during the password reset process
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to reset password',
                source: 'registerController - handlePasswordReset',
                userId: user.id,
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });

        //Respond with a server error
        return res.status(500).json({error : `Error occurred while reseting user password. ${error.message}`})
    }
};

/**
 * Handles adding a new user to an organization.
 * 
 * @param {Object} req - The HTTP request object containing user and session details.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response indicating success or failure.
 */
async function handleAddNewOrgUser (req, res) {
    //Ensure that request is coming from a logged in user with required roles
    if(!req.session || !req.session.user || !req.session.user.role !== "Admin"){
        return res.sendStatus(401);
    }

    //Extract new user's details from the request body
    const {userPassword, userFirstname, userLastname, userEmail } = req.body;

    //Validate that all required feilds are provided
    if(!userPassword || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({"Error occured while adding user to organization" : "All required fields must be filled."});
    }

    //Retrieve the creator (current session user) and organization details
    const creator = await User.findById(req.session.user.id);
    const organizationData = await Organization.findById(creator.organization);

    //Validate that the creator and organizaton exist
    if(!creator || !organizationData) {
        //Send Not Found status
        return res.sendStatus(404)
    }

    try{
        //Begin a database transaction
        await withTransaction(async (session) => {
            //Hash the new user's password
            const hashedPassword = await hashPassword(userPassword);

            //Create a new user object to add to the organization
            const subUser = new User({
                password: hashedPassword,
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: organizationData._id,
                createdBy: creator._id
            });

            //Save the new user within the transaction
            await subUser.save({ session })

            //Update the organization's user list to include the new user
            const updatedOrganization = await Organization.findByIdAndUpdate(
                organizationData._id,
                { $push:{ users: subUser._id}}, //Add new user's ID to the list 
                { new: true, session}
            )
            await updatedOrganization.save({session})

            //If the organization update fails, throw an error
            if(!updatedOrganization) {
                throw new Error ("Couldn't add user into organization");
            }

            //Log the new user creation
            await logActivity({
                action: 'create',
                collectionName: 'User',
                documentId: subUser._id,
                performedBy: creator._id,
                organizationId: organizationData._id,
                newData: subUser,
                session
            });

            //Log the organization update
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

        //Respond with success message
        return res.status(201).json({"Successfully added new user" : `New User has been added to Organization`});
    } catch(error) {
        //Handle errors during the user addition process
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

        //Respond with a server error message
        return res.status(500).json({
            "Message" : "Error occured while adding organization user",
            "Erorr" : error.message
        });
    }
};

/**
 * Handles adding a new camera to the organization.
 * 
 * @param {Object} req - The HTTP request object containing user session and camera details.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} Sends a JSON response indicating success or failure.
 */
async function addCameraToOrganization(req, res) {
    //Ensure that request is coming from a logged in user with required roles
    if(!req.session || !req.session.user || !req.session.user.role !== "Admin"){
        return res.sendStatus(401); //Unauthorized
    }

    //Extract camera details from the request body
    const {camName, camModel, camLocation} = req.body;

    //Validate required fields
    if (!camName || !camModel || !camLocation){
        return res.status(400).json({"Error occured while adding camera to organization":"All required fields must be filled."})
    } 

    //Fetch user and organization details
    const user = await User.findById(req.session.user.id);
    const organizationData = await Organization.findById(user.organization);

    //If user or organizationData don't exist
    if(!user || !organizationData) {
        return res.sendStatus(404)
    }

    try{
        //Begin a database transaction
        await withTransaction(async (session) => {     
            //Create and store camera in the database
            const newCamera = new Camera({
                camera_Name: camName,
                model: camModel,
                owner: owner,
                location: camLocation,
                users: [admin]
            });

            //Save the new camera in the transaction
            await newCamera.save({session});

            //Update the organization's camera list to include the new camera
            const updatedData = await Organization.findByIdAndUpdate(
                organizationData._id,
                { $push:{ cameras: newCamera._id}}, //Add the camera ID
                { new: true}
            )
            await updatedData.save({session});

            //Check if the camera was added successfully
            if(!updatedData) {
                throw new Error(`Could not add camera to organization ${organizationData.organizationName}`)
            }
            //Log the creation of the new camera
            await logActivity({
                action: 'create',
                collectionName: 'Camera',
                documentId: newCamera._id,
                organizationId: owner,
                performedBy: admin,
                organizationId: owner,
                performedBy: admin,
                newData: newCamera,
                session
            })

            //Log the update to the organization
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: owner,
                performedBy: admin,
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
        
        //Respond with success if everything works successfully
        return res.status(201).json({ 'Camera creation success': `New Camera: ${camName} created and added to organization!` });

    } catch(error) {
        //Log errors during the process
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to create new Camera',
                source: 'registerController - addCameraToOrganization',
                userId: admin,
                userId: admin,
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });
        //Respond with a server error message
        return res.status(500).json({"Error occured while adding camera to organization:":error.message})
    }
}

/**
 * Hashes a given password using bcrypt. 
 * 
 * @param {string} password - The plaintext password to hash.
 * @returns {Promise<string>} The hashed password.
 * @throws will throw an error if hasing fails.
 */
async function hashPassword (password) {
    try{
        //Use bcrypt to hash the password with a salt round of 10
        hashedPwd = await bcrypt.hash(password, 10);
        return hashedPwd;
    }
    catch(error) {
        //Log the error
        await withTransaction(async (session) => {
            await logError(null, { //`req` is undefined here. Replaced with null
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

/**
 * Retrieves details of camerea associated with the user's organization.
 * 
 * @param {Object} req - The HTTP request object containing user session.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} JSON response containing camera details or error message.
 */
async function getCameraDetails(req, res) {
    //Ensure that request is coming from a logged in user
    if(!req.session || !req.session.user || !req.session.user.id){
        return res.sendStatus(401); //Unauthorized
    }

    try{
        //Retrieve the user from the database
        const user = await User.findById(req.session.user.id);
        
        if(!user){
            return res.sendStatus(404); //User not found
        }

        //Retrieve the organization and populate its camera field
        const organization = await Organization.findById(user.organization._id)
            .populate({
                path: 'cameras',
                select: '_id camera_Name location status' //Only select necessary fields
        }).exec();

        if(!organization || !organization.cameras || organization.cameras.length === 0){
            return res.sendStatus(404) //No cameras found under organization
        }

        //Successfully retrieved camera details
        return res.status(200).json({
            cameras: organization.cameras
        })
    } catch (error) {
        //Log error during the process
        await withTransaction(async (session) => {   
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve Camera details',
                source: 'registerController - getCameraDetails',
                userId: req.session.user.id || 'System', //Include user ID if available
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });

        });
        
        //Respond with a server error
        return res.status(500).json({ error: `Error occured while getting camera details: ${error.message}`})
    }
}

/**
 * Retrieves the logged-in user's data.
 * 
 * @param {Object} req - The HTTP request object containing user session.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} JSON response containing user data or error message.
 */
async function getUserData(req, res){
    //Ensure that request is coming from a logged in user
    if(!req.session || !req.session.user){
        return res.sendStatus(401); //Unauthorized
    }

    try{
        //Fetch user data from the database, selecting only the necessary fields
        const userData = await User.findById(req.session.user.id)
            .select("firstname lastname email phone -_id") //Excluding the `_id` field since its there by default
            .lean()
            .exec();
        
        //Handle case where user data is not found
        if(!userData){
            return res.status(404) //Not found
        }

        //Respond with the user data
        return res.status(200).json({
            user: userData
        })
        
    } catch (error) {
        //Log the error
        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve users data',
                source: 'registerController - getUserData',
                userId: req.session.user.id || 'System', //Include user ID if available
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });

        //Respond with a server error
        return res.status(500).json({'Error occured while getting user data' : error.message})
    } 
}

/**
 * Retrieves organization users' data based on the logged-in user's session.
 * 
 * @param {Object} req - The HTTP request object containing the user session.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} JSON response containing organization users' data or error message
 */
async function getOrgUserData(req, res) {
    //Ensure that request is coming from a logged in user
    if(!req.session || !req.session.user){
        return res.sendStatus(401); //Unauthorized
    }

    try{
        //Find the logged-in user
        const user = await User.findById(req.session.user.id)

        //Ensure the user exists
        if(!user){
            return res.sendStatus(404); //User not found
        }

        //Fetch organization users with specified fields
        const orgUserArray = await getUserFields(user, ['firstname', 'lastname', 'email', 'lastLoggedIn', '-_id']) 

        //If no data is returned, respond with 404
        if(!orgUserArray || orgUserArray.length === 0){
            return res.sendStatus(404); //Not Found
        }
        //Return organization users
        return res.status(200).json({
            users: orgUserArray.users
        })
        
    } catch (error) {
        //Log errors using a transaction
        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve organization users',
                source: 'registerController - getOrgUsers',
                userId: req.session.user.id || 'System', //Include user ID if available
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });

        //Respond with a server error
        return res.status(500).json({'Error occured while getting user from organization' : error.message})
    } 
}

/**
 * Retrieves organization users' last login history based on the logged-in user's session.
 * 
 * @param {Object} req - The HTTP request object containing the user session.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} JSON response containing the user data or error message 
 */
async function getUserLastLogin(req, res) {
    //Ensure that request is coming from a logged in user
    if(!req.session || !req.session.user){
        return res.sendStatus(401); //Unauthorized
    }

    try{
        //Find the logged-in user
        const user = await User.findById(req.session.user.id)

        if(!user){
            return res.status(404); //User not found
        }

        //Fetch organization users last loggin with specified fields
        const lastLoginArray = await getUserFields(user, ["firstname", "lastname", "lastLoggedIn", "-_id"])

        //If no data is returned, respond with 404
        if(!lastLoginArray || lastLoginArray.length === 0){
            return res.sendStatus(404); //Not Found
        }

        //Return organization users last login history data
        return res.status(200).json({
            message: 'Login history found',
            users: lastLoginArray.users
        })
    } catch (error) {
        //Handle specific errors with clear status codes
        if(error.message === "404") return res.sendStatus(404); //Not found

        //Log errors using a transaction
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

        //Respond with server error
        return res.status(500).json({'Error occured while getting user from organization' : error.message})
    }
}

/**
 * Handles dynamic retrival of organization user data based on provided fiedls.
 * 
 * @param {Object} userId - The user ID of the requestor for data.
 * @param {Array} fields - Array containing the fields.
 * @returns {Object} Organization user data with specified fields.
 */
async function getUserFields(userId, fields = []) {
    try{
        //Join all selected fields
        const fieldSelection = fields.join(' ')

        //Find the organization that includes the user
        const orgUserListData = await Organization.findOne({users: userId})
            .populate({
                path: "users",
                select: fieldSelection
            })
            .lean()
            .exec();
        
        //If no users are found, return an empty array
        if(!orgUserListData || !orgUserListData.users || orgUserListData.users.length === 0) {
            return {users: []};
        }

        //Return organization user data
        return orgUserListData
    } catch (error) {
        throw new Error(error.message)
    }
}

/**
 * Handles retrieving data for organization details for logged-in user
 * 
 * @param {Object} req - The HTTP request object containing the user session.
 * @param {Object} res - The HTTP respond object.
 * @returns {Object} The organization details or error response.
 */
async function getOrganizationDetails(req, res){
    //Ensure that request is coming from a logged in user
    if(!req.session || !req.session.user){
        return res.sendStatus(401); //Unauthorized
    }

    try{
        //Retrieve user from the session
        const user = await User.findById(req.session.user.id);

        if(!user){
            return res.sendStatus(404); //User not found
        }

        //Set orgDetails to null initially until data is retrieved
        let orgDetails = null;

        //Retrieve organization details
        if(typeof user.organization !== "object" && user.organization.toLowerCase() === "individual"){
            return res.sendStatus(404); //Organization is individual
        } else{
            //Find organization of user
            orgDetails = await Organization.findById(user.organization);

            if(!orgDetails){
                return res.sendStatus(404); //Organization not found
            }
        }

        //Respond with organization details
        return res.status(200).json({
            organization: orgDetails
        });

    } catch (error) {
        //Log errors using a transaction
        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve organization detials',
                source: 'registerController - getOrganizationFields',
                userId: req.session.user.id || 'System', //Include user ID if available
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });

        //Respond with server error
        return res.status(500).json({'Error occured while getting organization detials' : error.message})
    }
}

/**
 * Handles retrieving all organizations that exist in database. 
 * Intended for AccountAdmin(for client aka Nate) use only.
 * 
 * @param {Object} req - The HTTP request object containing user session.
 * @param {Object} res - The HTTP response object. 
 * @returns {Object} JSON format of all organization data existing in the database.
 */
async function getOrganizationList(req, res){
    //Ensure that request is coming from a logged in user and has reqiured role
    if(!req.session || !req.session.user || (req.session.user.role).toLowerCase() !== 'accountadmin'){
        return res.sendStatus(401); //Unauthorized
    }

    //Retrieve user from the session
    const user = await User.findById(req.session.user.id)

    //If user is not found
    if(!user){
        return res.sendStatus(404);
    }

    try{
        //Retrieve all organizations
        const orgList = await Organization.find({});

        //Send the organization list as JSON
        return res.json(orgList) 

    } catch (error) {
        //Log errors with a transaction
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
        
        //Respond with a server error
        return res.status(500).json({'Error occured while getting organization list' : error.message})
    }
}

/**
 * Function to log out all users of an organization that are currently logged in
 * by deleteting all sessions associated with that organization.
 * 
 * @param {Object} req - The HTTP request object containing user session.
 * @param {string} orgId - The organization ID whose users' sessions need to be deleted. 
 */
async function getAllOrganizations(user){
    if((user.roles).toLowerCase() !== 'AccountAdmin'){
        throw new Error("403") //Throw error if user is not authorized
    }

    const organizations = await Organization.find({})
    return organizations
}

// Function used to get the name of the current user. Currently used to display name in the Dashboard html
const getCurrentUserFirstName = async(req, res) => {

    try{
        if(req.session && req.session.user){  // Check for login
            const userId = req.session.user.id; // Get ID from request object
            const currentUser = await User.findById(userId); 
            const nameString = ', ' + currentUser.firstname; // Add comma here, rather than in raw HTML, so if the name is not found the greeting will be "Welcome Back!"
            res.json({ name: nameString });
        } else{
            res.json( { name: '!' } ) // If the user is logged in and the name isn't found, return generic greeting
        }
    } catch(error) {
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'TRACE',
                desc: 'Failed to find name of current user',
                source: 'getCurrentUserFirstName',
                userId: req.session.user ? req.session.user.id: 'unknown',
                code: '500',
                meta: {error: error.message},
                session
            });
        });
        res.status(500).json({message: 'Failed to find name of current user', error: error.message})
    }
    
}

// Function to log out all users of an organization that are currently logged in
async function deactivateOrg(req, orgId) {
    // Allows access to sessions without making a dedicated model since we are using mongo-connect
    let Session = mongoose.model('Session', new mongoose.Schema({}, { collection: 'sessions' }));

    try {
        // Delete all sessions associated with the given organization ID
        let result = await Session.deleteMany({ organization: {id: orgId }}); 
        
        //Log the deactivation activity
        await logActivity({
            action: 'Organization Deactivation - ' + orgId,
            collectionName: 'sessions',
            performedBy: req.session.user.id
        });

    } catch (error) {
        //Log error with a transaction
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                level: 'ERROR',
                desc: 'Failed to deactivate organization',
                source: 'deactivateOrg',
                userId: req.session.user ? req.session.user.id: 'unknown',
                code: 'ORG_DEACTIVATE_ERROR',
                meta: {error: error.message},
                session
            });
        });

        throw new Error(`Error deactivating organization: ${error.message}`);
    }
}

/**
 * Updates the status of an organization. 
 * 
 * @param {Object} req - The HTTP request Object containing user session.
 * @param {Object} res - The HTTP response Object.
 * @returns 
 */
async function updateOrganizationStatus(req, res){
    //Ensure that request is coming from a logged in user and has reqiured role
    if(!req.session || !req.session.user){
        return res.sendStatus(401); //Unauthorized
    }

    const newStatus = req.body.status;
    const orgToUpdate = req.body.orgId;

    try{
        //Find the organization to fetch the current status
        const organization = Organization.findById(orgToUpdate);
        if(!organization){
            return res.sendStatus(404); //Not found
        }

        const originalStatus = organization.status;

        //Begin a database transaction
        await withTransaction(async (session) => {
            //Update the organizatoin's status
            await Organization.findByIdAndUpdate(
                orgToUpdate,
                {$set: {status: newStatus}},
                {new: true, session}
            )       
            
            //If the new status is "Inactive", deactivate the organization
            if(newStatus == "Inactive") {
                await deactivateOrg(req, orgToUpdate);
            }

            //Log the activity of updating organization status
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
        //Log error with a transaction
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                level: 'ERROR',
                desc: 'Failed to update organization status',
                source: 'updateOrganizationStatus',
                userId: req.session.user ? req.session.user.id: 'unknown',
                code: 'ORG_UPDATE_ERROR',
                meta: {error: error.message},
                session
            });
        });

        //Respond with server error
        return res.status(500).json({message: 'Failed to update organization information', error: error.message})
    }
    
}


//TODO: Add activity logging
/**
 * Handles updating the organization information by updated data provided for authorized users. 
 * 
 * @param {Object} req - The HTTP request object containing user session. 
 * @param {Object} res - The HTTP response object.
 * @returns 
 */
async function updateOrganizationInfo(req, res){
    //Ensure that request is coming from a logged in user and has reqiured role
    if(!req.session.user || 
        ((req.session.user.role).toLowerCase() !== 'admin' && (req.session.user.role).toLowerCase() !== "accountadmin")
    ){
        return res.status(401).json({ message: "Unauthorized to make changes!"}); //Unauthorized
    }

    try{
        const updatedData = req.body
        console.log(updatedData)
        //Begin database transaction
        await withTransaction(async (session) => {
            //Update the organization data based on new data
            const updatedOrganization = await Organization.findByIdAndUpdate(
                req.session.org.id,
                {$set: updatedData},
                {new: true, session}
            )

            //If updating organization fails
            if(!updatedOrganization){
                return res.status(400).json({ message: "Couldn't find organization or error in data received"}); //Organization Not Found
            }
        })

        //Respond with success status
        return res.status(200).json({message: 'Organization information updated successfully'})

    } catch (error){
        //Log error with a transaction
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

        //Respond with a server error
        return res.status(500).json({message: 'Failed to update organization information', error: error.message})
    } 
}


/**
 * Handles updating the cameras under a certian organization
 * 
 * @param {Object} req - The HTTP request object containing user session.
 * @param {Object} res - The HTTP response object.
 * @returns 
 */
async function updateCameraInfo(req, res){
    //Ensure that request is coming from a logged in user and has reqiured role
    if(!req.session.user || (req.session.user.role).toLowerCase() !== 'admin'){
        return res.sendStatus(401)
    }

    try{
        const {updatedInfo, cameraInfo} = req.body

        //Being a database transaction
        await withTransaction(async (session) => {
            //Update the existing camera information
            await Camera.findByIdAndUpdate(
                cameraInfo,
                {$set: updatedInfo},
                {new: true, session}
            )
        })

        //Respond with success status
        return res.status(200).json({message: 'Camera information updated successfully'})

    } catch (error){
        //Log errors with a transaction
        await withTransaction(async (session) => {
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to update Camerea information',
                source: 'updateCameraInfo',
                userId: req.session.user ? req.session.user.id: 'unknown',
                code: 'CAMERA_UPDATE_ERROR',
                meta: {error: error.message},
                session
            });
        });

        //Respond with server error 
        return res.status(500).json({message: 'Failed to update camera information', error: error.message})
    } 
}


//Exports
module.exports = { 
    handleNewUser, 
    handleNewOrganization, 
    deleteOrganizationUser, 
    handlePasswordReset, 
    handleAddNewOrgUser, 
    addCameraToOrganization,
    getCameraDetails,
    getUserData,
    getOrgUserData,
    getUserLastLogin,
    getOrganizationDetails,
    getOrganizationList,
    getCurrentUserFirstName,
    getCurrentUserFirstName,
    updateOrganizationInfo,
    updateOrganizationStatus,
    updateCameraInfo
};