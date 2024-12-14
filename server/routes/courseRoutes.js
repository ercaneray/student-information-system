const express = require('express');
const {
    getAllCourses,
    getCourseByID,
    getCourseByDepartmentID,
    getStudentCourses,
    getPendingRequests,
    createCourse,
    updateCourse,
    deleteCourse,
    requestApproval,
    approveRequest,
    denyRequest,
    checkRequest
} = require('../controllers/courseController');
const router = express.Router();

// GET all courses
router.get('/get', getAllCourses);

// GET course by ID
router.get('/get/:id', getCourseByID);

// Get course by DepartmentID
router.get('/get/department/:id', getCourseByDepartmentID);

// GET Students courses by studentID
router.get('/get/student/:id', getStudentCourses);

// GET pending approval courses by DepartmentID
router.get('/get/pending-requests/:id', getPendingRequests);

// POST create course
router.post('/create', createCourse);

// PUT update course
router.patch('/update/:id', updateCourse);

// DELETE course
router.delete('/delete/:id', deleteCourse);

// PUT request approval
router.put('/request-approval', requestApproval);

// PUT approve course requet
router.put('/approve-request/', approveRequest);

// DElETE deny course request
router.delete('/deny-request/:id', denyRequest);

// GET Check request
router.get('/check-request/:id', checkRequest);
module.exports = router;