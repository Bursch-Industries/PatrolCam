
const Test = require('../model/Test');
const bcrypt = require('bcrypt');

const userLogin = async (req, res) => {

    console.log('Entering userLogin');

    const { username, password } = req.body;
    if (!username || !password) {
        console.log('username or password missing')
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    try {
        console.log('entering try block');
        // Check for user in the database
        const user = await Test.findOne({ username: username}).exec();
        if (user){
            console.log('User found: ' + user)
        }
        

        // Check for password in the database 
        const validatePassword = await bcrypt.compare(password, user.password);

        if (validatePassword) {
            //req.session.user = { id: username };
            console.log('Logged in');
        }    

        res.status(200).json({ 'message': 'Logged In' });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

// Logout Function to Destroy Session
const userLogout = async (req, res) => {
    
    try {
        req.session.destroy()
        res.redirect(301, '/')

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { userLogin, userLogout };
