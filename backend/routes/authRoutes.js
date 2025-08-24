const express = require('express');
const { register, login, agentLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/agent-login', agentLogin);

module.exports = router;