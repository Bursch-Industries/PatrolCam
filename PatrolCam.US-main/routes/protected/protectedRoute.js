const express = require('express');
const router = express.Router();
const path = require('path');


protectedRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'../..', 'pages', 'protected', 'protection.html'));
})


module.exports = protectedRouter