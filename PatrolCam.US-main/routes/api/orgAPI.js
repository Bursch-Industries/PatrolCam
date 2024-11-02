const express = require('express');
const router = express.Router();
const orgQueries = require('../../queries/orgQueries');

router.get('/', orgQueries.getAllOrgs);
router.get('/page', orgQueries.getOrgPage);
router.get('/:id', orgQueries.getOrgByID);


module.exports = router;