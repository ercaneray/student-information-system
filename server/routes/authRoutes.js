const express = require('express');
const { login, logout, checkAuth } = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/login', login);

router.get('/logout', logout);

router.get('/checkAuth', verifyToken, checkAuth);

module.exports = router;