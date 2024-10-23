const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');


router.post('/', registerController.handleNewUser);
router.post('/org', registerController.handleNewOrganization);
router.post('/newOrgUser', registerController.handleAddNewOrgUser);
router.post('/addNewCam', registerController.addCameraToOrganization);
router.post('/resetpwd', registerController.handlePasswordReset)

router.delete('/delUser', registerController.deleteOrganizationUser)

router.get('/getCams', registerController.getCameraDetails)
router.get('/getOrgUserData', registerController.getOrgUserData)
router.get('/getUserLastLogin', registerController.getUserLastLogin)

module.exports = router;