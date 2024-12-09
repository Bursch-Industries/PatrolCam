const express = require('express');
const router = express.Router();
const orgQueries = require('../../queries/orgQueries');

router.get('/page', orgQueries.getOrgPage);
router.get('/loginData', orgQueries.getOrgLoginData);
router.get('/:id/loginData', orgQueries.getOrgLoginData);
router.get('/:id', orgQueries.getOrgByID);
router.get('/:id/cameraData', orgQueries.getOrgCamData);
router.get('/:id/userData', orgQueries.getOrgUserData);


module.exports = router;