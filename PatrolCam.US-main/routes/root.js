const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'index.html'));
})

router.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'sign-up.html'));
})

router.get('/demo', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'demo.html'));
})

router.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'test.html'))
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

router.get('/logIndex', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'logIndex.html'))
});

module.exports = router