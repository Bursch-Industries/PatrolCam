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

router.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'test.html'))
})

router.get('/logged-out', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'logged-out.html'))
})

router.get('/org-settings', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'org-settings.html'));
})

router.get('/org-settings.js', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'FrontEndJavaScript', 'org-settings.js'));
})



router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'login.html'))
});

router.get('/cameras', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'camera_page.html'))
});

router.get('/test-contact', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'test-contact.html'))
});

module.exports = router