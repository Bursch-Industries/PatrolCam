const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');

router.post('/', registerController.handleNewUser);
router.post('/org', registerController.handleNewOrgantization);
router.post('/newOrgUser', registerController.handleAddNewOrgUser);

router.delete('/delUser', registerController.handleDeleteUser)

router.post('/resetpwd', registerController.handlePwdReset)

module.exports = router;