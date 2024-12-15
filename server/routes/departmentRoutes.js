const express = require('express');
const {
    getAllDepartments
} = require('../controllers/departmentController');
const router = express.Router();

// GET all departments

router.get('/get', getAllDepartments);

module.exports = router;