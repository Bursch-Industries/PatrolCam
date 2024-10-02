
const Test = require('../model/Test');
const bcrypt = require('bcrypt');

const testLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

    try {

    
    // check for user in the database
    const user = await Test.findOne({ username: username}).exec();
    console.log('Usercheck: ' + user)

    // Check for password in the database 
    const validatePassword = await bcrypt.compare(password, user.password);

    if (validatePassword) {
        req.session.user = { id: username };
        console.log('Logged in');
    } 

        res.redirect('/')
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { testLogin };
