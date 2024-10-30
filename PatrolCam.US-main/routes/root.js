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

router.get('/logged-out', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'logged-out.html'))
})

router.get('/org-settings', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'org-settings.html'));
})

router.get('/userSettings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'userSettings.html'))
});

router.get('/logDemo', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'logDemo.html'))
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'login.html'))
});

router.get('/cameras', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'camera_page.html'))
});

router.get('/logIndex', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'logIndex.html'))
});

router.get('/401', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', '401.html'))
});

router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'dashboard.html'))
});

module.exports = router