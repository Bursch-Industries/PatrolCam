const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');

router.post('/', registerController.handleNewUser);
router.post('/org', registerController.handleNewOrganization);
router.post('/newOrgUser', registerController.handleAddNewOrgUser);
router.post('/addNewCam', registerController.addCameraToOrganization);

router.delete('/delUser', registerController.deleteOrganizationUser)

router.post('/resetpwd', registerController.handlePasswordReset)

router.get('/getCams', registerController.getCameraDetails)

module.exports = router;