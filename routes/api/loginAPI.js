const express = require('express');
const router = express.Router();
const loginController = require('../../controllers/loginController');


router.post('/login', loginController.userLogin);
router.post('/logout', loginController.userLogout)

module.exports = router;