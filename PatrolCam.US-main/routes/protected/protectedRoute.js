const express = require('express');
const protectedRouter = express.Router();
const path = require('path');
const requireAuth = require('../../middleware/authMiddleware');



protectedRouter.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname,'../..', 'pages', 'protected', 'protection.html'));
})


module.exports = protectedRouter