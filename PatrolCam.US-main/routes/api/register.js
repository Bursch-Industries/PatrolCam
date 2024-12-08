const express = require('express');
const router = express.Router();
const registerController = require('../../controllers/registerController');


router.post('/newUser', registerController.handleNewUser);
router.post('/newOrg', registerController.handleNewOrganization);
router.post('/newOrgUser', registerController.handleAddNewOrgUser);
router.post('/addNewCam', registerController.addCameraToOrganization);
router.post('/resetpwd', registerController.handlePasswordReset)


router.delete('/delUser', registerController.deleteOrganizationUser)

router.get('/getCams', registerController.getCameraDetails)
router.get('/getUserInfo', registerController.getUserData)
router.get('/getOrgUsers', registerController.getOrgUserData)
router.get('/getUsersLastLogin', registerController.getUserLastLogin)
router.get('/getOrg', registerController.getOrganizationDetails)
router.get('/getOrgList', registerController.getOrganizationList)

router.put('/updateOrg', registerController.updateOrganizationInfo)
router.put('/updateOrgStatus', registerController.updateOrganizationStatus);
router.put('/updateOrgCam', registerController.updateCameraInfo)

module.exports = router;