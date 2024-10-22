const express = require('express');
const router = express.Router();
const emailController = require('../../controllers/emailController');


router.post('/contact', emailController.sendContactFormEmail);


module.exports = router;