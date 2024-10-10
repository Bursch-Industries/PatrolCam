const express = require('express');
const router = express.Router();
const testController = require('../../controllers/testController');
const testLogin = require('../../controllers/loginController');

router.post('/test-signup', testController.testFunction);
router.post('/login', testLogin.userLogin);
router.post('/logout', testLogin.userLogout)

module.exports = router;