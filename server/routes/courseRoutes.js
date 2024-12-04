const express = require('express');
const {
    getAllCourses,
    getCourseByID,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const router = express.Router();

// GET all courses
router.get('/get', getAllCourses);

// GET course by ID
router.get('/get/:id', getCourseByID);

// POST create course
router.post('/create', createCourse);

// PUT update course
router.patch('/update/:id', updateCourse);

// DELETE course
router.delete('/delete/:id', deleteCourse);

module.exports = router;