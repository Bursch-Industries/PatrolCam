// This file contains routers for pages that should only be accessible to persons who are logged in.

const express = require('express');
const protectedRouter = express.Router();
const path = require('path');
const requireAuth = require('../../middleware/authMiddleware');
<<<<<<< HEAD
const isSessionExpired = require('../../controllers/sessionController');


protectedRouter.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname,'..', '..', 'pages', 'protected', 'protection.html'));
});
=======



protectedRouter.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname,'../..', 'pages', 'protected', 'protection.html'));
})
>>>>>>> Ethan_Off_Midterm

protectedRouter.get('/checkSession', isSessionExpired);

module.exports = protectedRouter;