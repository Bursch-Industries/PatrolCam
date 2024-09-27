const User = require('../model/User');
const Organization = require('../model/Organization');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
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

const handleNewOrgantization = async (req, res) => {
    const { orgName, user, pwd } = req.body;
    if (!orgName || !user || !pwd) return res.status(400).json({ 'Organization error message' : 'Organization Name, User and Password are required.'});

    //check for duplicate usernames in the database
    const duplicate = await Organization.findOne({ organizationName: orgName}).exec();
    if (duplicate) return res.sendStatus(409); //Duplicate conflict

    try{
        //encrypt password
        const hashedPwd = await hashPassword(pwd);

        //create and store organization
        const result = await Organization.create({
            "organizationName" : orgName,
            "username" : user,
            "password": hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New Organization ${orgName} created!`})
    } catch (err){
        res.status(500).json({ 'Orgnaization message': err.message});
    }
}

const handleDeleteUser = async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({"Delete Error message" : "Username cannot be empty!!"});

    try{
        const deleteUser = await User.findOneAndDelete({username})

        if(!deleteUser){
            return res.status(400).json({ "Delete Error message" : "User not found."})
        }
        return res.status(200).json({ "Deletion Confirmation" : `User ${username} deleted Successfully!`})
    } catch (error){
        return res.status(500).json({ "Delete Error message" : "Error occured while deleting user", error : error.message})
    }
};

const handlePwdReset = async (req, res) => {
    const { username, newPwd } = req.body;
    if (!username, !newPwd) return res.status(400).json({"Password Reset error" : "Username and new password cannot be empty!"});

    try{
        const newHashedPwd = await hashPassword(newPwd);
        const resetPwd = await User.findOneAndUpdate(
            {username},
            {password : newHashedPwd}
        )

        if (!resetPwd) {
            return res.status(404).json({ "Password Reset error" : "User not found!"})
        }

        return res.status(200).json({"Password Reset Success" : `Password Reset for ${username} succcessfully!`})
    } catch (error){
        return res.status(500).json({"Password Reset error" : "An error occured while resetting password", error : error.message})
    }
};

//hash passsword function
const hashPassword = async (password) => {
    hashedPwd = await bcrypt.hash(password, 10);
    return hashedPwd;
}

module.exports = { handleNewUser, handleNewOrgantization, handleDeleteUser, handlePwdReset};