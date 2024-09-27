const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');

router.post('/', registerController.handleNewUser);
router.post('/org', registerController.handleNewOrgantization);

router.delete('/delUser', registerController.handleDeleteUser)

module.exports = router;