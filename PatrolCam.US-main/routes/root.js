const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'index.html'));
})

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', '.html'));
})

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', '.html'));
})

module.exports = router