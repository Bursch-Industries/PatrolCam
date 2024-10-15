const express = require('express');
const router = express.Router();
const userQueries = require('../../queries/userQueries');

router.get('/', userQueries.getAllUsers);
router.get('/:id', userQueries.getUserByID);

module.exports = router;