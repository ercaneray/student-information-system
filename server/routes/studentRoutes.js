const express = require('express');
const {
    getAllStudents,
    getStudentByID,
    getStudentByCourseConnections,
    createStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');
const router = express.Router();

// GET all students
router.get('/get', getAllStudents);

// GET student by ID
router.get('/get/:id', getStudentByID);

// Get students by Course connections
router.get('/get-connections/:id', getStudentByCourseConnections);

// POST create student
router.post('/create', createStudent);

// PUT update student
router.patch('/update/:id', updateStudent);

// DELETE student
router.delete('/delete/:id', deleteStudent);

module.exports = router;