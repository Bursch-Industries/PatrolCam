
const User = require('../model/User'); 
const bcrypt = require('bcryptjs');
const { withTransaction } = require('./transactionHandler');
const { logError } = require('./errorLogger'); 


const userLogin = async (req, res) => {

    const { email, password } = req.body;

    try {

        // Check for user in the database
        const user = await User.findOne({ email: email}).exec();

        if(!user) {
            return res.status(401).json({ message: 'invalid-credentials' });
        }

        // Check for password in the database and compare
        const validatePassword = await bcrypt.compare(password, user.password);


        if (validatePassword) {

            // Set session information here
            req.session.user = { id: user._id, username: user.username, role: user.roles };
            return res.sendStatus(200);
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
                userId: username, 
                code: '500',
                meta: { message: err.message, stack: err.stack },
                session
            });

        });

        console.log(err.message)
        res.sendStatus(500);
    }
}

// Logout Function to Destroy Session
const userLogout = async (req, res) => {
    
    
    try {
        req.session.destroy()
        res.redirect(301, '/login')

    } catch (err) {

        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Logout Failed',
                source: 'loginController',
                userId: req.session.user, 
                code: '500',
                meta: { message: err.message, stack: err.stack },
                session
            });

        });
        res.status(500).json({ 'message': err.message });
    }
}


module.exports = { userLogin, userLogout };
