const express = require('express');
const router = express.Router();
const { getAllNonAdminUsers, getMessageByID, getUserMessages, deleteMessage, createMessage } = require('../controllers/messageController');

// GET message by ID
router.get('/get/:id', getMessageByID);

// Delete message by ID
router.delete('/delete/:id', deleteMessage);

// GET my messages
router.get('/getUserMessages/:id', getUserMessages);

// GET all users
router.get('/getAllNonAdmin', getAllNonAdminUsers);

// POST create message
router.post('/create', createMessage);

module.exports = router;