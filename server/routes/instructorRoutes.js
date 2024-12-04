const express = require('express');
const {
    getAllInstructors,
    getInstructorByID,
    createInstructor,
    updateInstructor,
    deleteInstructor
} = require('../controllers/instructorController');
const router = express.Router();

// GET all instructors
router.get('/get', getAllInstructors);

// GET instructor by ID
router.get('/get/:id', getInstructorByID);

// POST create instructor
router.post('/create', createInstructor);

// PUT update instructor
router.patch('/update/:id', updateInstructor);

// DELETE instructor
router.delete('/delete/:id', deleteInstructor);

module.exports = router;