const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer(); // Memory storage for file uploads
const audioConroller = require('../../controllers/audioController');

router.post('/audioAnalyze', upload.single('audio'), audioConroller.handleAudioAnalyze);

module.exports = router;