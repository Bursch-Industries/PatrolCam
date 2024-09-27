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
        const hashedPwd = await bcrypt.hash(pwd, 10);

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
        const hashedPwd = await bcrypt.hash(pwd, 10);

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
    if (!username) return res.status(400).json({"Delete Error message" : "Username can not be empty!!"});

    try{
        const deleteUser = await User.findOneAndDelete({username})

        if(!deleteUser){
            return res.status(400).json({ "Delete Error message" : "User not found."})
        }
        return res.status(200).json({ "Deletion Confirmation" : `User ${username} deleted Successfully!`})
    } catch (err){
        return res.status(500).json({ "Delete Error message" : "Error occured while deleting user", error : error.message})
    }
};

module.exports = { handleNewUser, handleNewOrgantization, handleDeleteUser};