const express = require('express');
const { getOverview, getTrends } = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Admin-only endpoints
router.get("/overview", authMiddleware(['admin']), getOverview);
router.get("/trends", authMiddleware(['admin']), getTrends);

module.exports = router;