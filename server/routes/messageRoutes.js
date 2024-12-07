const express = require('express');
const router = express.Router();
const { getMessageByID, getMyMessages, deleteMessage } = require('../controllers/messageController');

// GET message by ID
router.get('/get/:id', getMessageByID);

// Delete message by ID
router.delete('/delete/:id', deleteMessage);

// GET my messages
router.get('/getMyMessages/:id', getMyMessages);

module.exports = router;