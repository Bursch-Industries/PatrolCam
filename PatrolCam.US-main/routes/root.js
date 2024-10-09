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

<<<<<<< HEAD
router.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'test.html'))
})

=======
router.get('/org-settings', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'org-settings.html'));
})

router.get('/org-settings.js', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'FrontEndJavaScript', 'org-settings.js'));
})
>>>>>>> origin/Ethan

module.exports = router