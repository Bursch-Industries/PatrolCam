const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'index.html'));
})

router.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'sign-up.html'));
})

router.get('/patrolcam-demo', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'patrolcam-demo.html'));
})

router.get('/org-settings', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'org-settings.html'));
})

module.exports = router