const express = require('express');
const router = express.Router();
const path = require('path');
const requireAuth = require('../middleware/authMiddleware');
const isSessionExpired = require('../controllers/sessionController');
const loggedIn = require('../middleware/loggedIn');

// --- Pages that differ based on being logged in ---
router.get('/', (req, res) => {
    if(loggedIn) {
        res.sendFile(path.join(__dirname, '..', 'pages', 'logIndex.html'));
    } else {
        res.sendFile(path.join(__dirname, '..', 'pages', 'index.html'));
    }
})


// --- Pages that differ based on role --- 
router.get('/dashboard', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', `${req.session.user.role}`, 'dashboard.html'));
});

router.get('/demo', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', `${req.session.user.role}`, 'dashboard.html'));
});

router.get('/cameras', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', `${req.session.user.role}`, 'camera_page.html'));
});

router.get('/org-settings', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', `${req.session.user.role}`, 'org-settings.html'));
})

// --- Pages that do not differ based on role or require authentication ---
router.get('/logged-out', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'logged-out.html'))
})

router.get('/userSettings', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'pages', 'userSettings.html'))
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', 'login.html'))
});

router.get('/401', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', '401.html'))
});

router.get('/404', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'pages', '404.html'))
});

// Check for session expiration
router.get('/checkSession', isSessionExpired);


module.exports = router