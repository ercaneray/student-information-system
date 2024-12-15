const express = require('express');
const {
    getAllInstructors,
    getInstructorByID,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    addCourseToInstructor,
    getConnectedCourses
} = require('../controllers/instructorController');
const router = express.Router();

// GET all instructors
router.get('/get', getAllInstructors);

// GET instructor by ID
router.get('/get/:id', getInstructorByID);

// Get connected courses
router.get('/get-connections/:id', getConnectedCourses);

// POST create instructor
router.post('/create', createInstructor);

// PUT update instructor
router.patch('/update/:id', updateInstructor);

// DELETE instructor
router.delete('/delete/:id', deleteInstructor);

// POST add course to instructor
router.post('/add-connection/:id', addCourseToInstructor);

module.exports = router;