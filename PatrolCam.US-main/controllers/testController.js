const Test = require('../model/Test');
const bcrypt = require('bcrypt');

const testFunction = async (req, res) => {
    const { user, pwd, email } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await Test.findOne({ username: user }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await Test.create({
            "username": user,
            "password": hashedPwd,
            "email": email
        });

        console.log(result);

        res.status(201).json({ 'success': `New test ${Test} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { testFunction };