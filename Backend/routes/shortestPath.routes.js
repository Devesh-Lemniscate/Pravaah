const express = require('express');
const router = express.Router();
const { getShortestPaths } = require('../controllers/shortestPath.controller');

router.post('/shortest-paths', getShortestPaths);

module.exports = router;