const Test = require('../model/Test');
const bcrypt = require('bcrypt');

const testFunction = async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await Test.findOne({ username: username }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        //create and store the new user
        const result = await Test.create({
            "username": username,
            "password": hashedPwd,
            "email": email
        });

        res.redirect('/')
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { testFunction };