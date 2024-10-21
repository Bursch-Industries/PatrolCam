const User = require('../model/User'); //User schema
const Organization = require('../model/Organization'); //Organization schema
const Camera = require('../model/Camera'); //Camera schema
const bcrypt = require('bcrypt'); //For hashing passwords
const  { logActivity }  = require('./logger');
const { withTransaction } = require('./transactionHandler')

//Handles new user creation
async function handleNewUser (req, res) {
    const { user, password, userFirstname, userLastname, userEmail, phone, rank } = req.body;

    //Check missing request fields
    if (!user || !password || !userFirstname || !userLastname || !userEmail){
        return res.status(400).json({ 'Error while creating new user': 'All required fields must be filled.' });
    }

    //Check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Duplicate conflict 

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
        //Server error
        res.status(500).json({ 'Error occured while creating user': error.message });
    }
}

//Handles new organization creation
async function handleNewOrganization (req, res) {
    const { orgName, orgEmail, orgPhone, orgAddress, user, password, userFirstname, userLastname, userEmail } = req.body;

    //Check missing request fields
    if (!orgName || !orgPhone || !orgAddress || !user || !password || !orgEmail || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({ 
            'Error occured while creating new organization' : 'All required fields must be filled.'
        });
    }

    //Check for duplicate usernames in the database
    const duplicate = await Organization.findOne({ organizationName: orgName}).exec();
    if (duplicate) return res.sendStatus(409); //Duplicate conflict

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
        //server error
        res.status(500).json({ error: `Error occured while creating organization ${error.message}`});
    }
}

//Deletes user using username
async function deleteOrganizationUser (req, res) {
    const { username, admin } = req.body;

    //Check missing request fields
    if (!username || !admin) return res.status(400).json({
        "Error occured while deleting user" : "All required fields must be filled."
    });

    const deletedBy = await findUser(admin)
    const user = await findUser(username)

    //Check if user or performedBy is undefined
    if(!deletedBy || !user){
        return res.status(404).json( "User not found.")
    }

    //Check if both users are from the same organization and action performers role is set to creator
    if(!deletedBy.organization.equals(user.organization) || !checkUserRole(deletedBy)){
        return res.status(403).json({"Access Denied" : `User: ${deletedBy.username} cannot perform delete action`});
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
        //Server error
        return res.status(500).json({error : `Error occured while deleting user ${error.message}`})
    }
};

//User password reset
async function handlePasswordReset (req, res) {
    const { username, newPwd } = req.body;

    //check missing request fields
    if (!username || !newPwd) {
        return res.status(400).json({"Password Reset error" : "All required fields must be filled."});
    }

    try{
        await withTransaction(async (session) => {
            const newHashedPwd = await hashPassword(newPwd);//Hash new password
            const user = await findUser(username);//Find user by username
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
        //Server error
        return res.status(500).json({error : `Error occurred while reseting user password. ${error.message}`})
    }
};

//Adding new user into organization
async function handleAddNewOrgUser (req, res) {
    const {creator, user, userPassword, userFirstname, userLastname, userEmail } = req.body;

    //Check missing request fields
    if(!creator || !user || !userPassword || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({"Adding organization user" : "All required fields must be filled."});
    }
    let subUser;
    try{
        await withTransaction(async (session) => {
            //Find organization ID of the Creator
            const [orgId, creatorId] = await findOrganizationCreator(creator);

            //If user wasn't found or access was denied
            if(orgId.error) {
                return res.status(orgId.error === "User not found" ? 404 : 403).json({
                    "Error occured while adding camera to organization" : orgId.error
                })
            }

            //Hash user password
            const hashedPassword = await hashPassword(userPassword);

            //Create and store the subuser of organization
            const subUser = new User({
                username: user,
                password: hashedPassword,
                firstname: userFirstname,
                lastname: userLastname,
                email: userEmail,
                organization: orgId,
                createdBy: creatorId
            });

            await subUser.save({ session })

            //Original state of organization
            const originalData = await Organization.findById(orgId)

            //Add the new sub user into the organization user list
            const updatedOrganization = await Organization.findByIdAndUpdate(
                orgId,
                { $push:{ users: subUser.id}},
                { new: true, session}
            );

            //If updating users list failed
            if(!updatedOrganization) {
                throw new Error ("Couldn't add user into organization");
            }

            //Log sub user creation
            await logActivity({
                action: 'create',
                collectionName: 'User',
                documentId: subUser._id,
                performedBy: creatorId,
                organizationId: orgId,
                newData: subUser,
                session
            });

            //Log organization update
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: orgId,
                performedBy: creatorId,
                originalData: {
                    originalUsers: originalData.users
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
    if (!camName || !username || !camModel || !camLocation){
        return res.status(400).json({"Error occured while adding camera to organization":"All required fields must be filled."})
    } 
    try{
        await withTransaction(async (session) => {
            //Find organization ID of the user
            const [orgId, userId] = await findOrganizationCreator(username)

            //If user wasn't found or access was denied
            if(orgId.error) {
                return res.status(orgId.error === "User not found" ? 404 : 403).json({
                    "Error occured while adding camera to organization" : orgId.error
                })
            }

            //Create and store camera in database
            const newCamera = new Camera({
                camera_Name: camName,
                model:camModel,
                owner: orgId._id,
                location: camLocation,
                users: [userId]
            });
            await newCamera.save({session});

            //Original state of organization
            const originalData = await Organization.findById(orgId)

            //Update the camera list in organization
            const newData = await Organization.findByIdAndUpdate(
                orgId,
                { $push:{ cameras: newCamera.id}},
                { new: true}
            )
            await newData.save({session});

            //Check if the camera was added successfully
            if(!newCamera) return res.status(400).json({ 'Camera creation error' : `Couldnot add camera to organization ${orgId.organizationName}` })
            
            //Log new camera creation
            await logActivity({
                action: 'create',
                collectionName: 'Camera',
                documentId: newCamera._id,
                organizationId: orgId._id,
                performedBy: userId,
                newData: newCamera,
                session
            })

            //Log organization update
            await logActivity({
                action: 'update',
                collectionName: 'Organization',
                documentId: orgId._id,
                performedBy: userId,
                originalData: {
                    originalCameras: originalData.cameras
                },
                newData: {
                    updatedCameras: newData.cameras
                },
                session
            })
        })
        
        //Camera was created & added successfully
        return res.status(201).json({ 'Camera creation success': `New Camera: ${camName} created and added to organization!` });

    } catch(error) {
        //Server error
        return res.status(500).json({"Error occured while adding camera to organization:":error.message})
    }
}

async function findOrganizationCreator (creator) {
    try {
        //Find the creator user
        const user = await findUser(creator);
        if(!user){
            throw new Error('User not found') //Throw error if user not found
        }

        //Check if user has "Creator" role
        const isCreator = checkUserRole(user) //Checks user authorization
        if (!isCreator) {
            throw new Error('Access Denied!') //Throw access denied error if user isn't authorized
        } 

        return [(await user.populate('organization')).organization, user._id]

    } catch (error) {
        throw new Error(`Error occured while searching for creator: ${error.message}`)
    }
};

//Hash passsword function
async function hashPassword (password) {
    try{
        hashedPwd = await bcrypt.hash(password, 10);
        return hashedPwd;
    }
    catch(error) {
        throw new Error("Error occured while hashing password" + error.message)
    }
}

//Check if the user role is "Creator"
function checkUserRole(user){
    if (!user || !user.roles) {
        return false //Return false if user or roles are not defined
    }

    //Case insensitive check for string roles
    return user.roles.toLowerCase() === "creator" 
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
        return res.status(400).json({error: "All fields are required"})
    }

    try{
        const user = await findUser(username)
        
        if(!user){
            return res.status(404).json({error: `User ${username} not found`})
        }

        const organization = await Organization.findById(user.organization._id).populate({
            path: 'cameras',
            select: 'camera_Name location status'
        }).exec();

        if(!organization || !organization.cameras || !organization.cameras.length === 0){
            return res.status(404).json({
                message: `No cameras found for organization associated with user ${username}.`
            })
        }

        return res.status(200).json({
            message: `Cameras found for user ${username}`,
            cameras: organization.cameras
        })
    } catch (error) {
        res.status(500).json({ error: `Error occured while getting camera details: ${error.message}`})
    }
}
module.exports = { 
    handleNewUser, 
    handleNewOrganization, 
    deleteOrganizationUser, 
    handlePasswordReset, 
    handleAddNewOrgUser, 
    addCameraToOrganization,
    getCameraDetails
};