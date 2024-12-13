const sql = require('mssql');
const config = require('../config/sqlconfig.js');

// GET all Course
const getAllCourses = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`SELECT [CourseID]
      ,[CourseName]
      ,[Akts]
      ,[Semester]
      ,[Class]
      ,[RequiredCourseID]
	  ,D.DepartmentName
FROM Courses C LEFT JOIN Departments D ON C.DepartmentID = D.DepartmentID`);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Get Course by ID
const getCourseByID = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.params.id)
            .query(`SELECT * FROM Courses 
            WHERE CourseID = @CourseID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }
}

// Create Course
const createCourse = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.body.CourseID)
            .input('CourseName', sql.VarChar, req.body.CourseName)
            .input('Akts', sql.Int, req.body.Akts)
            .query(`INSERT INTO Courses (CourseID, CourseName, Akts)
                VALUES (@CourseID, @CourseName, @Akts)`);
        res.status(201).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}

// Update Course
const updateCourse = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.body.CourseID)
            .input('CourseName', sql.VarChar, req.body.CourseName)
            .input('Akts', sql.Int, req.body.Akts)
            .query(`UPDATE Courses
                SET CourseName = @CourseName, 
                    Akts = @Akts
                WHERE CourseID = @CourseID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }

}

// Delete Course
const deleteCourse = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.params.id)
            .query('DELETE FROM Courses WHERE CourseID = @CourseID');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Get  a student's courses by studentID
const getStudentCourses = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.params.id)
            .query(`SELECT * FROM Courses 
            WHERE CourseID IN (
                SELECT CourseID FROM StudentCourse
                WHERE StudentID = @StudentID
            )`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }

}
// Get a student's requestable courses by DepartmentID

module.exports = {
    getAllCourses,
    getCourseByID,
    createCourse,
    updateCourse,
    deleteCourse,
    getStudentCourses
}