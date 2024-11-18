
const User = require('../model/User'); 
const Org = require("../model/Organization");
const bcrypt = require('bcryptjs');
const { withTransaction } = require('./transactionHandler');
const { logError } = require('./errorLogger'); 


function generateRandomString() {

    console.log('generating new string');
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

    console.log('entering userLogin');
    console.log('email: ' + email);
    console.log('password: ' + password);
    console.log('rememberMeBool: ' + rememberMeBool);
    console.log('rememberMeValue: ' + rememberMeValue);

    try {

        // Check for user in the database
        const user = await User.findOne({ email: email}).exec();

        if(!user) {
            return res.status(401).json({ message: 'invalid-credentials' });
        }

        console.log('user found');

        // Check if the user is active
        if(user.status != "Active") {
            return res.status(401).json({ message: 'This account is not active'})
        }

        console.log('user is active');

        // Check if user is part of an organization. If they are, make sure it is active.
        if(user.organization != 'Individual') {
            // Fetch the organization that the user is from
            const userOrg = await Org.findById(user.organization);

            // Check if the organization is active
            if(userOrg.status != "Active") {
                return res.status(401).json({ message: 'This organization is not active'});
            }
        }
        
        console.log('org is active');

        if(rememberMeBool == true) { // User wants to be remembered

            console.log('user wants to be remembered')

            if(rememberMeValue == '') { // User not previously remembered

                console.log('user not previously remembered')

                // Verify login via password
                const validatePassword = await bcrypt.compare(password, user.password); 

                if(validatePassword){
                    console.log('password validated')
                    const newVal = generateRandomString();
                    await User.updateOne({_id: user._id}, {$set: {rememberMe: newVal}});
                    await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
    
                    // Set session information here
                    req.session.user = { id: user._id, role: user.roles };
                    return res.status(200).json({message: `${newVal}`});
                } else {    
                    return res.status(401).json({ message: 'invalid-credentials' });
                }
            } else if (user.rememberMe === rememberMeValue) { // User was previously remembered

                console.log('user was previously remembered')
                
                // Update the lastLoggedIn field in the user record
                await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
    
                // Set session information here
                req.session.user = { id: user._id, role: user.roles };
                return res.status(200).json({ message: `${rememberMeValue}`});
            } else {    

                // If the user is remembered and still enters their password, log them in via password and update rememberMe value in db
                if(password && password != "••••••••••••"){
                    console.log('password value not null: ' + password);

                    // Verify login via password
                    const validatePassword = await bcrypt.compare(password, user.password); 

                    if(validatePassword){
                        console.log('password validated')
                        const newVal = generateRandomString();
                        await User.updateOne({_id: user._id}, {$set: {rememberMe: newVal}});
                        await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
    
                        // Set session information here
                        req.session.user = { id: user._id, role: user.roles };
                        return res.status(200).json({message: `${newVal}`});
                    }
                }
                console.log('rememberMe value did not match db value')
                return res.status(401).json({ message: 'invalid-credentials' });
            }
        } else { // User has not selected to be remembered

            console.log('user does not want to be remembered')

            if(rememberMeValue == '') { // User was not previously remembered, verify with password

                console.log('user was not previously remembered')

                // Check for password in the database and compare
                const validatePassword = await bcrypt.compare(password, user.password);
    
                if (validatePassword) {
    
                    // Update the lastLoggedIn field in the user record
                    await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
    
                    // Set session information here
                    req.session.user = { id: user._id, role: user.roles };
                    return res.sendStatus(200);
                } 
                else {    
                    return res.status(401).json({ message: 'invalid-credentials' });
            }
            } else { // User was previously remembered, verify with rememberValue and reset

                console.log('user was previously remembered')
                console.log('user.rememberMe: ' + JSON.stringify(user));
    
                if (rememberMeValue == user.rememberMe) {
                    
                    console.log('user rememberMe matched');
                    // Update the lastLoggedIn field in the user record
                    await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
                    await User.updateOne({_id: user._id}, {$set: {rememberMe: ''}});
    
                    // Set session information here
                    req.session.user = { id: user._id, role: user.roles };
                    return res.status(200);
                } 
                else {    
                    if(password && password != "••••••••••••"){
                        console.log('password value not null: ' + password);
    
                        // Verify login via password
                        const validatePassword = await bcrypt.compare(password, user.password); 
    
                        if(validatePassword){
                            console.log('password validated')
                            await User.updateOne({_id: user._id}, {$set: {rememberMe: ""}});
                            await User.updateOne({_id: user._id}, {$set: {lastLoggedIn: Date.now()}});
        
                            // Set session information here
                            req.session.user = { id: user._id, role: user.roles };
                            return res.status(200);
                        }
                    }
                    console.log('rememberMe value did not match')
                    if(user.rememberMe == "") {
                        console.log('db value null')
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
