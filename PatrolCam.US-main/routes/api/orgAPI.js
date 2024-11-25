const express = require('express');
const router = express.Router();
const orgQueries = require('../../queries/orgQueries');

router.get('/', orgQueries.getAllOrgs);
router.get('/page', orgQueries.getOrgPage);
router.get('/userData', orgQueries.getOrgUserData);
router.get('/:id', orgQueries.getOrgByID);
router.get('/:id/cameraData', orgQueries.getOrgCamData);
router.get('/:id/userData', orgQueries.getOrgUserData);


module.exports = router;