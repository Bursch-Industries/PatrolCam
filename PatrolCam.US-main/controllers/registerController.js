const User = require('../model/User'); //user schema
const Organization = require('../model/Organization'); //organization schema
const Camera = require('../model/Camera'); //camera schema
const bcrypt = require('bcrypt'); //for hashing passwords
const { logNewUserCreation, logOrganizationCreation, logSubUserCreation, logDeleteOrganizationUser, logPasswordReset } = require('./logger');

//handles new user creation
async function handleNewUser (req, res) {
    const { user, password, userFirstname, userLastname, userEmail  } = req.body;
    if (!user || !password || !userFirstname || !userLastname || !userEmail){
        return res.status(400).json({ 'message': 'Username, password, firstname, lastname, and email are required.' });
    }

    //check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPassword = await hashPassword(password);
        
        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPassword,
            "firstname":userFirstname,
            "lastname":userLastname,
            "email":userEmail
        });
        await result.save();

        await logNewUserCreation(result._id, "System", {
            username: user,
            firstname: userFirstname,
            lastname: userLastname,
            email: userEmail
        });

        res.status(201).json({ 'User creation success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'Error occured while creating user': err.message });
    }
}

//handles new organization creation
async function handleNewOrganization (req, res) {
    const { orgName, orgEmail, user, password, userFirstname, userLastname, userEmail } = req.body;
    if (!orgName || !user || !password || !orgEmail || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({ 
            'Organization error message' : 'Organization Name, Username, Password, Organization email, user firstname, user lastname, user email are required.'
        });
    }
    //check for duplicate usernames in the database
    const duplicate = await Organization.findOne({ organizationName: orgName}).exec();
    if (duplicate) return res.sendStatus(409); //Duplicate conflict

    try{
        //encrypt the password
        const hashedPassword = await hashPassword(password);

        //create and store the owner of organization
        const owner = new User({
            username: user,
            password: hashedPassword,
            roles: 'Creator',
            firstname: userFirstname,
            lastname: userLastname,
            email: userEmail,
            organization: null //null since we don't have organization id yet
        });
        await owner.save();

        //create and store organization
        const newOrgantization = await Organization.create({
            organizationName : orgName,
            owner: owner._id,
            users: [owner._id], //attach owner id to keep track of creator
            organizationEmail: orgEmail,
        });

        await newOrgantization.save();

        //update the organization for the user
        await User.findByIdAndUpdate(owner, {organization: newOrgantization._id});

        //Log new organization creation
        await logOrganizationCreation(newOrgantization._id, owner.username, {
            organizationName : orgName,
            owner: owner._id,
            users: [owner._id], 
            organizationEmail: orgEmail,
        })

        res.status(201).json({ 'success': `New Organization ${orgName} created!`})
    } catch (error){
        res.status(500).json({ 'Orgnaization message': error.message});
    }
}

//deletes user using username
async function deleteOrganizationUser (req, res) {
    const { username, admin } = req.body;

    //check if request body is empty
    if (!username || !admin) return res.status(400).json({"Delete Error message" : "username and admin cannot be empty!!"});

    try{
        const performedBy = await findUser(admin)
        const user = await findUser(username)

        //check if user is undefined
        if(!performedBy || !user){
            return res.status(404).json({"Delete Error message" : "User not found."})
        }

        //check if both users are from the same organization and action performers role is set to creator
        if(performedBy.organization.equals(user.organization) && checkUserRole(performedBy)){
            
            //remove user from organization
            await Organization.findByIdAndUpdate(
                performedBy.organization,
                { $pull: {users: user._id}},
                { new: true}
            )
            
            await User.deleteOne({username})//locate username and delete

            await logDeleteOrganizationUser(user._id, performedBy.username, user.organization)//log delete activity

            return res.status(200).json({"Deletion Confirmation" : `User ${username} deleted Successfully!`})//deletion success
        }

        //if action can't be performed
        return res.status(403).json({"Access Denied" : `User: ${performedBy.username} cannot perform delete action`});

    } catch (error){
        return res.status(500).json({"Delete Error message" : "Error occured while deleting user", error : error.message})
    }
};

//user password reset
async function handlePasswordReset (req, res) {
    const { username, newPwd } = req.body;
    if (!username || !newPwd) return res.status(400).json({"Password Reset error" : "Username and new password cannot be empty!"});

    try{
        const newHashedPwd = await hashPassword(newPwd);//hash new password
        const user = await findUser(username)
        const resetPassword = await User.findOneAndUpdate( //update new password over in database
            {username},
            {password : newHashedPwd}
        )
        await logPasswordReset(user._id, user.organization, user.username, user.password, newHashedPwd)//Log password reset

        //if password reset failed
        if (!resetPassword) {
            return res.status(404).json({ "Password Reset error" : "User not found!"})
        }

        

        return res.status(200).json({"Password Reset Success" : `Password Reset for ${username} succcessfully!`})//success
    } catch (error){
        return res.status(500).json({"Password Reset error" : error.message})
    }
};

async function handleAddNewOrgUser (req, res) {
    const {creator, user, userPassword, userFirstname, userLastname, userEmail } = req.body;

    //Check missing fields
    if(!creator || !user || !userPassword || !userFirstname || !userLastname || !userEmail) {
        return res.status(400).json({"Adding organization user" : "Creator, username, user password and email cannot be empty!"});
    }

    try{
        //Find organization ID of the Creator
        const orgId = await findOrganizationCreator(creator);

        if(orgId.error === "User not found") {
            return res.status(404).json({"Error occured while adding organization user" : orgId.error})
        }

        if(orgId.error === 'Access Denied!') {
            return res.status(403).json({"Error occured while adding organization user" : orgId.error})
        }

        //Hash user password
        const hashedPassword = await hashPassword(userPassword);

        //create and store the subuser of organization
        const subUser = new User({
            username: user,
            password: hashedPassword,
            firstname: userFirstname,
            lastname: userLastname,
            email: userEmail,
            organization: orgId
        });
        await subUser.save();
        
        //Add the new sub user into the organization user list
        const organization = await Organization.findByIdAndUpdate(
            orgId,
            { $push:{ users: subUser.id}},
            { new: true}
        );

        //If updating users list failed
        if(!organization) {
            return res.status(400).json({"Adding organization user" : `Couldn't add user into organization`});
        }

        //Log sub user creation
        await logSubUserCreation(subUser._id, creator, organization._id, {
            username: user,
            firstname: userFirstname,
            lastname: userLastname,
            email: userEmail,
        })

        //Successfully added new user
        return res.status(201).json({"Successfully added new user" : `New User ${subUser.username} has been added to Organization ${orgId.organizationName}`});
    } catch(error) {
        return res.status(500).json({"Message" : "Error occured while adding organization user", "Erorr" : error.message});
    }
};

async function findOrganizationCreator (creator) {
    try {
        //Find the creator user
        const user = await findUser(creator);
        if(!user){
            return {error : 'User not found'}; //return error if user not found
        }

        //Check if user has "Creator" role
        const isCreator = checkUserRole(user);
        if (isCreator) {
            return (await user.populate('organization')).organization
        } else {
            return {error: 'Access Denied!'} //Not a creator, so return null
        }
    } catch (error) {
        throw new Error("Error occured while searching for creator " + error.message)
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

//Handles adding camera to organization
async function addCameraToOrganization(req, res) {
    const {camName, username, camModel, camLocation} = req.body;
    if (!camName || !username || !camModel || !camLocation){
        return res.status(400).json({"Error occured while adding camera to organization":"Camera, username, camModel and camLocation cannot be empty!"})
    } 
    try{
        const orgId = await findOrganizationCreator(username)

        if(orgId.error === "User not found") {
            return res.status(404).json({"Error occured while adding camera to organization" : orgId.error})
        }

        if(orgId.error === 'Access Denied!') {
            return res.status(403).json({"Error occured while adding camera to organization" : orgId.error})
        }
        
        const newCamera = new Camera({
            camera_Name: camName,
            model:camModel,
            owner: orgId,
            location: camLocation,
            users: username.id,
            org_id: orgId
        });
        await newCamera.save();

        const organization = await Organization.findByIdAndUpdate(
            orgId,
            { $push:{ cameras: newCamera.id}},
            { new: true}
        )
        await organization.save();

        if(!newCamera) return res.status(400).json({ 'Camera creation error' : `Couldnot add camera to organization ${orgId.organizationName}` })

        return res.status(201).json({ 'Camera creation success': `New Camerea ${camName} created and added to organization ${orgId.organizationName}!` });

    } catch(error) {
        return res.status(500).json({"Error occured while adding camera to organization:":error.message})
    }
}

//Check if the user role is "Creator"
function checkUserRole(user){
    return user.roles === "Creator";
}

async function findUser(username){
    const user = await User.findOne({username:username})

    if(!user){
        return false
    }

    return user
}
module.exports = { handleNewUser, handleNewOrganization, deleteOrganizationUser, handlePasswordReset, handleAddNewOrgUser, addCameraToOrganization};