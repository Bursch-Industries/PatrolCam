const User = require('../model/User');
const Organization = require('../model/Organization');
const bcrypt = require('bcrypt');

async function handleNewUser (req, res) {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await hashPassword(pwd);
        
        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

async function handleNewOrgantization (req, res) {
    const { orgName, user, pwd } = req.body;
    if (!orgName || !user || !pwd) return res.status(400).json({ 'Organization error message' : 'Organization Name, Username and Password are required.'});

    //check for duplicate usernames in the database
    const duplicate = await Organization.findOne({ organizationName: orgName}).exec();
    if (duplicate) return res.sendStatus(409); //Duplicate conflict

    try{
        //encrypt the password
        const hashedPwd = await hashPassword(pwd);

        //create and store the owner of organization
        const owner = new User({
            username: user,
            password: hashedPwd,
            roles: 'Creator',
            organization: null //null since we don't have organization id yet
        });
        await owner.save();

        //create and store organization
        const newOrgantization = await Organization.create({
            organizationName : orgName,
            owner: owner._id,
            users: [owner._id] //attach owner id to keep track of creator
        });

        await newOrgantization.save();

        //update the organization for the user
        await User.findByIdAndUpdate(owner, {organization: newOrgantization._id});

        res.status(201).json({ 'success': `New Organization ${orgName} created!`})
    } catch (err){
        res.status(500).json({ 'Orgnaization message': err.message});
    }
}

//deletes user using username
async function handleDeleteUser (req, res) {
    const { username } = req.body;
    if (!username) return res.status(400).json({"Delete Error message" : "Username cannot be empty!!"});

    try{
        const deleteUser = await User.findOneAndDelete({username})//locate username and delete

        //check if user exists in database
        if(!deleteUser){
            return res.status(400).json({"Delete Error message" : "User not found."})
        }
        return res.status(200).json({"Deletion Confirmation" : `User ${username} deleted Successfully!`})
    } catch (error){
        return res.status(500).json({"Delete Error message" : "Error occured while deleting user", error : error.message})
    }
};

//user password reset
async function handlePwdReset (req, res) {
    const { username, newPwd } = req.body;
    if (!username, !newPwd) return res.status(400).json({"Password Reset error" : "Username and new password cannot be empty!"});

    try{
        const newHashedPwd = await hashPassword(newPwd);//hash new password
        const resetPwd = await User.findOneAndUpdate( //update new password over in database
            {username},
            {password : newHashedPwd}
        )

        //if password reset failed
        if (!resetPwd) {
            return res.status(404).json({ "Password Reset error" : "User not found!"})
        }

        return res.status(200).json({"Password Reset Success" : `Password Reset for ${username} succcessfully!`})
    } catch (error){
        return res.status(500).json({"Password Reset error" : "An error occured while resetting password", error : error.message})
    }
};

const handleAddNewOrgUser = async (req, res) => {
    const {creator, username, userPassword} = req.body;
    if(!creator, !username, !userPassword) return res.status(400).json({"Adding organization user" : "Creator and username cannot be empty!"});

    try{
        const orgId = await findOrganizationCreator(creator);
        const hashedPwd = await hashPassword(userPassword);
        const newUser = new User({
            username: username,
            password: hashedPwd,
            organization: orgId
        });
        await newUser.save();
        
        const organization = await Organization.findByIdAndUpdate(
            orgId,
            { $push:{ users: newUser.id}},
            { new: true}
        );

        if(!organization){ 
            return res.status(400).json({"Adding organization user" : `Couldn't add user into organization`});
        }

        return res.status(200).json({"Successfully added new user" : `New User ${newUser.username} has been added to Organization ${orgId.organizationName}`});
    } catch(error) {
        return res.status(400).json({"Error occured while adding organization user" : "",error : error.message});
    }
};

async function findOrganizationCreator (creator) {
    try {
        const user = await User.findOne({username:creator}).populate('organization');

        if(!user) return res.status(400).json({"Error occured while searching for creator":'User not found'});

        if(user.roles !== 'Creator') return res.status(400).json({"Error occured while searching for creator":`User ${creator} is not a creator`})
        
        return user.organization;
    } catch (error) {
        return res.status(400).json({"Error occured while searching for creator" : "",error : error.message})
    }
};

//hash passsword function
async function hashPassword (password) {
    hashedPwd = await bcrypt.hash(password, 10);
    return hashedPwd;
}

module.exports = { handleNewUser, handleNewOrgantization, handleDeleteUser, handlePwdReset, handleAddNewOrgUser};