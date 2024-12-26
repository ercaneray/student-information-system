const sql = require('mssql');
const config = require('../config/sqlconfig.js');
const bcrypt = require('bcrypt');

// GET all student
const getAllInstructors = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`SELECT [InstructorID]
      ,[FirstName]
      ,[LastName]
      ,[Password]
      ,I.RoleID
      ,R.RoleName
      ,D.DepartmentName FROM Instructors I
        JOIN Departments D ON I.DepartmentID = D.DepartmentID
        JOIN Roles R ON I.RoleID = R.RoleID`);
        const sanitizedInstructors = result.recordset.map(instructor => {
            delete instructor.Password; // Şifre alanını kaldır
            return instructor;
        });
        res.status(200).json(sanitizedInstructors);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Get Instructor by ID
const getInstructorByID = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('InstructorID', sql.Int, req.params.id)
            .query(`SELECT * FROM Instructors 
            WHERE InstructorID = @InstructorID`
            );
        const sanitizedInstructors = result.recordset.map(instructor => {
            delete instructor.Password; // Şifre alanını kaldır
            return instructor;
        });
        res.status(200).json(sanitizedInstructors);
    } catch (error) {
        console.error(error);
        res.status(404).send('An error occurred');
    }
}
// Create Instructor
const createInstructor = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('InstructorID', sql.Int, req.body.InstructorID)
            .input('FirstName', sql.NVarChar, req.body.FirstName)
            .input('LastName', sql.NVarChar, req.body.LastName)
            .input('Password', sql.VarChar, req.body.Password)
            .input('DepartmentID', sql.Int, req.body.DepartmentID)
            .input('RoleID', sql.Int, req.body.RoleID)
            .query(`INSERT INTO Instructors (InstructorID, FirstName, LastName, Password, DepartmentID, RoleID )
                VALUES (@InstructorID, @FirstName, @LastName, @Password, @DepartmentID, @RoleID)`);
        res.status(201).json(result.recordset);

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Update Instructor
const updateInstructor = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('InstructorID', sql.Int, req.body.InstructorID)
            .input('FirstName', sql.NVarChar, req.body.FirstName)
            .input('LastName', sql.NVarChar, req.body.LastName)
            .input('Department', sql.VarChar, req.body.Department)
            .input('Faculty', sql.VarChar, req.body.Faculty)
            .input('Password', sql.VarChar, bcrypt.hashSync(req.body.Password, 10))
            .query(`UPDATE Instructors
                SET FirstName = @FirstName, 
                    LastName = @LastName, 
                    Password = @Password, 
                    Department = @Department,
                    Faculty = @Faculty
                WHERE InstructorID = @InstructorID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }

}
// Delete Instructor
const deleteInstructor = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('InstructorID', sql.Int, req.params.id)
            .query('DELETE FROM Instructors WHERE InstructorID = @InstructorID');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error); // Hata detaylarını logla
        res.status(500).send('An error occurred');
    }
}
// Add course to instructor
const addCourseToInstructor = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('InstructorID', sql.Int, req.params.id)
            .input('CourseID', sql.Int, req.body.CourseID)
            .query(`INSERT INTO InstructorCourse (InstructorID, CourseID)
                VALUES (@InstructorID, @CourseID)`);
        res.status(201).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Get connected courses
const getConnectedCourses = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('InstructorID', sql.Int, req.params.id)
            .query(`SELECT C.CourseID, C.CourseName, C.Akts, C.Semester, C.Class FROM InstructorCourse I
            JOIN Courses C ON I.CourseID = C.CourseID
            WHERE I.InstructorID = @InstructorID`);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}


module.exports = {
    getAllInstructors,
    getInstructorByID,
    createInstructor,
    updateInstructor,
    deleteInstructor,
    addCourseToInstructor,
    getConnectedCourses
}