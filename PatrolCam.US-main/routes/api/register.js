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
router.get('/getOrgUsers', registerController.getOrgUserData)
router.get('/getUsersLastLogin', registerController.getUserLastLogin)
router.get('/getOrg', registerController.getOrganizationDetails)

module.exports = router;