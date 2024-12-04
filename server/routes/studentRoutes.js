const express = require('express');
const { getAllStudents, getStudentByID, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const router = express.Router();

// GET all students
router.get('/get', getAllStudents);

// GET student by ID
router.get('/get/:id', getStudentByID);

// POST create student
router.post('/create', createStudent);

// PUT update student
router.patch('/update/:id', updateStudent);

// DELETE student
router.delete('/delete/:id', deleteStudent);

module.exports = router;