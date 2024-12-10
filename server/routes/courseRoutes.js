const express = require('express');
const {
    getAllCourses,
    getCourseByID,
    createCourse,
    updateCourse,
    deleteCourse,
    getStudentCourses
} = require('../controllers/courseController');
const router = express.Router();

// GET all courses
router.get('/get', getAllCourses);

// GET course by ID
router.get('/get/:id', getCourseByID);

// GET Students courses by studentID
router.get('/get/student/:id', getStudentCourses);

// POST create course
router.post('/create', createCourse);

// PUT update course
router.patch('/update/:id', updateCourse);

// DELETE course
router.delete('/delete/:id', deleteCourse);

module.exports = router;