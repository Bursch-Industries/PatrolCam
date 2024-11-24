// This file contains routers for pages that should only be accessible to persons who are logged in.

const express = require('express');
const protectedRouter = express.Router();
const path = require('path');
const requireAuth = require('../../middleware/authMiddleware');
const isSessionExpired = require('../../controllers/sessionController');


protectedRouter.get('/', (req, res) => {
    if (requireAuth(req)) {
        res.sendFile(path.join(__dirname,'..', '..', 'pages', 'logIndex.html'));
    }
    else {
        res.sendFile(path.join(__dirname,'..', '..', 'pages', 'index.html'));
    }
});

protectedRouter.get('/checkSession', isSessionExpired);

module.exports = protectedRouter;