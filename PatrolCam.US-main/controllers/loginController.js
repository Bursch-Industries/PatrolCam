
const User = require('../model/User'); 
const Org = require("../model/Organization");
const bcrypt = require('bcryptjs');
const { withTransaction } = require('./transactionHandler');
const { logError } = require('./errorLogger'); 
const Organization = require('../model/Organization');


function generateRandomString() {

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const userLogin = async (req, res) => {

    const { email, password, rememberMeBool, rememberMeValue } = req.body;

    try {

        // Check for user in the database, case insensitive
        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });

        if(!user) {
            return res.status(401).json({ message: 'invalid-credentials' });
        }

        // Check if the user is active
        if(user.status != "Active") {
            return res.status(401).json({ message: 'This account is not active'})
        }

        // Check if user is part of an organization. If they are, make sure it is active.
        if(user.organization != 'Individual') {
            // Fetch the organization that the user is from
            const userOrg = await Org.findById(user.organization);

            // Check if the organization is active
            if(userOrg.status != "Active") {
                return res.status(401).json({ message: 'This organization is not active'});
            }
        }

        // The following code will allow the user to be remembered on their browser. As is, only one device can be tracked at a time. Would recommend letting the browser handle this 
        if(rememberMeBool == true) { // User wants to be remembered

            if(rememberMeValue == '') { // User not previously remembered

                // Verify login via password
                const validatePassword = await bcrypt.compare(password, user.password); 

                if(validatePassword){
                    const newVal = generateRandomString();
                    await User.updateOne({_id: user._id}, {$set: {rememberMe: newVal}});
                    await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
    
                    // Set session information
                    req.session.user = { id: user._id, role: user.roles };
                    req.session.org = {id: user.organization};
                    return res.status(200).json({message: `${newVal}`});
                } else {    
                    return res.status(401).json({ message: 'invalid-credentials' });
                }
            } else if (user.rememberMe === rememberMeValue) { // User was previously remembered

                // Update the lastLoggedIn field in the user record
                await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
    
                // Set session information
                req.session.user = { id: user._id, role: user.roles };
                req.session.org = {id: user.organization};
                return res.status(200).json({ message: `${rememberMeValue}`});
            } else {    

                // If the user is remembered and still enters their password, log them in via password and update rememberMe value in database
                if(password && password != "••••••••••••"){

                    // Verify login via password
                    const validatePassword = await bcrypt.compare(password, user.password); 

                    if(validatePassword){
                        const newVal = generateRandomString();
                        await User.updateOne({_id: user._id}, {$set: {rememberMe: newVal}});
                        await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
    
                        // Set session information
                        req.session.user = { id: user._id, role: user.roles };
                        req.session.org = {id: user.organization};
                        return res.status(200).json({message: `${newVal}`});
                    }
                }
                return res.status(401).json({ message: 'invalid-credentials' });
            }
        } else { // User has not selected to be remembered

            if(rememberMeValue == '') { // User was not previously remembered, verify with password

                // Check for password in the database and compare
                const validatePassword = await bcrypt.compare(password, user.password);
    
                if (validatePassword) {
    
                    // Update the lastLoggedIn field in the user record
                    await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
    
                    // Set session information
                    req.session.user = { id: user._id, role: user.roles };
                    req.session.org = {id: user.organization};
                    return res.sendStatus(200);
                } 
                else {    
                    return res.status(401).json({ message: 'invalid-credentials' });
            }
            } else { // User was previously remembered, verify with rememberValue and reset
    
                if (rememberMeValue == user.rememberMe) {
                    
                    // Update the lastLoggedIn field in the user record
                    await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
                    await User.updateOne({_id: user._id}, {$set: {rememberMe: ''}});
    
                    // Set session information here
                    req.session.user = { id: user._id, role: user.roles };
                    req.session.org = {id: user.organization};
                    return res.status(200);
                } 
                else { // User was previously remembered, the local storage doesn't match, and they entered a password 
                    if(password && password != "••••••••••••"){
    
                        // Verify login via password
                        const validatePassword = await bcrypt.compare(password, user.password); 
    
                        if(validatePassword){
                            await User.updateOne({_id: user._id}, {$set: {rememberMe: ""}});
                            await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
        
                            // Set session information here
                            req.session.user = { id: user._id, role: user.roles };
                            req.session.org = {id: user.organization};
                            return res.status(200);
                        }
                    }
                    if(user.rememberMe == "") { // No rememberMe value found in database
                        return res.status(401).json({ message: 'db-value-null'})
                    }
                    return res.status(401).json({ message: 'invalid-credentials' });
            }
            }
            
        }
        
    } catch (err) {


        await withTransaction(async (session) => {
                
            await logError(req, {
                level: 'ERROR',
                desc: 'Login Failed',
                source: 'loginController',
                userId: email, 
                code: '500',
                meta: { message: err.message, stack: err.stack },
                session
            });

        });
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
