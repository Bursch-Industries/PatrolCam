
const Test = require('../model/Test'); // REPLACE with User model
const bcrypt = require('bcryptjs');
const { withTransaction } = require('./transactionHandler');
const { logError } = require('./errorLogger'); 

const userLogin = async (req, res) => {


    const { username, password } = req.body;

    // REPLACE with client-side js for validation
    if (!username || !password) {
        console.log('username or password missing')
        return res.sendStatus(400).json({ message: 'Username and password are required.' });
    }

    try {


        // Check for user in the database
        const user = await Test.findOne({ username: username}).exec();
        if(!user) {
            console.log('user not found in db')
            return res.status(401).json({ message: 'invalid-credentials' });
        }

        // Check for password in the database and compare
        const validatePassword = await bcrypt.compare(password, user.password);

        if (validatePassword) {

            // Set session information here
            req.session.user = { id: username }; // REPLACE with user object ID

          
           
            res.sendStatus(200);
        } 
        else {    
            return res.status(401).json({ message: 'invalid-credentials' });
        }
    } catch (err) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Login Failed',
                source: 'loginController',
                userId: { id: username }, // REPLACE with user object ID
                code: '500',
                meta: { message: err.message, stack: err.stack },
                session
            });

        });

        res.sendStatus(500).json({ message: err.message });
    }
}

// Logout Function to Destroy Session
const userLogout = async (req, res) => {
    
    try {
        req.session.destroy()
        res.redirect(301, '/')

    } catch (err) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Logout Failed',
                source: 'loginController',
                userId: { id: username }, // REPLACE with user object ID
                code: '500',
                meta: { message: err.message, stack: err.stack },
                session
            });

        });
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { userLogin, userLogout };
