const sql = require('mssql');
const config = require('../config/sqlconfig.js');
const bcrypt = require('bcrypt');


// GET all student
const getAllStudents = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM vw_StudentsWithDepartments');
        const sanitizedStudents = result.recordset.map(student => {
            delete student.Password; // Şifre alanını kaldır
            return student;
        });
        res.status(200).json(sanitizedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Get student by ID
const getStudentByID = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.params.id)
            .query(`SELECT * FROM Students 
            WHERE StudentID = @StudentID`
            );
        const sanitizedStudents = result.recordset.map(student => {
            delete student.Password; // Şifre alanını kaldır
            return student;
        });
        res.status(200).json(sanitizedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Get students by Course connections
const getStudentByCourseConnections = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('CourseID', sql.Int, req.params.id)
            .query(`SELECT S.StudentID, S.FirstName, S.LastName, S.Class
            FROM Students S
            JOIN StudentCourse SC ON S.StudentID = SC.StudentID
            WHERE SC.CourseID = @CourseID`
            );
        res.status(200).json(result.recordset);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}
// Create student
const createStudent = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.body.StudentID)
            .input('FirstName', sql.NVarChar, req.body.FirstName)
            .input('LastName', sql.NVarChar, req.body.LastName)
            .input('Password', sql.VarChar, req.body.Password, 10)
            .input('DepartmentID', sql.Int, req.body.DepartmentID)
            .input('Class', sql.Int, req.body.Class)
            .query(`INSERT INTO Students (StudentID, FirstName, LastName, Password, DepartmentID, Class)
                VALUES (@StudentID, @FirstName, @LastName, @Password, @DepartmentID, @Class)`);
        res.status(201).json(result.recordset);
    } catch (error) {
        console.error(error); // Hata detaylarını logla
        res.status(500).send('An error occurred');
    }
}
// Update student
const updateStudent = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.body.StudentID)
            .input('FirstName', sql.NVarChar, req.body.FirstName)
            .input('LastName', sql.NVarChar, req.body.LastName)
            .input('Password', sql.VarChar, req.body.Password)
            .input('DepartmentID', sql.Int, req.body.DepartmentID)
            .input('Class', sql.Int, req.body.Classs)
            .query(`UPDATE Students
                SET FirstName = @FirstName, 
                    LastName = @LastName, 
                    Password = @Password, 
                    DepartmentID = @DepartmentID, 
                    Class = @Class
                WHERE StudentID = @StudentID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        console.log(req.body);
        res.status(404).send('An error occurred');
    }

}
// Delete student
const deleteStudent = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.params.id)
            .query('DELETE FROM Students WHERE StudentID = @StudentID');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error); // Hata detaylarını logla
        res.status(404).send('An error occurred');
    }
}

module.exports = {
    getAllStudents,
    getStudentByID,
    getStudentByCourseConnections,
    createStudent,
    updateStudent,
    deleteStudent
}