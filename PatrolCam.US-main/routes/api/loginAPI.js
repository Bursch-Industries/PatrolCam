const express = require('express');
const router = express.Router();
const testLogin = require('../../controllers/loginController');


router.post('/login', testLogin.userLogin);
router.post('/logout', testLogin.userLogout)

module.exports = router;