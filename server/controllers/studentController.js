const sql = require('mssql');
const config = require('../config/sqlconfig.js');
const bcrypt = require('bcrypt');


// GET all student
const getAllStudents = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`SELECT [StudentID]
      ,[FirstName]
      ,[LastName]
      ,[Password]
      ,[Agno]
      ,[RoleID]
      ,[Class]
      ,D.DepartmentName FROM Students S
        JOIN Departments D ON S.DepartmentID = D.DepartmentID`);
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

// Create student
const createStudent = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('StudentID', sql.Int, req.body.StudentID)
            .input('FirstName', sql.NVarChar, req.body.FirstName)
            .input('LastName', sql.NVarChar, req.body.LastName)
            .input('Password', sql.VarChar, bcrypt.hashSync(req.body.Password, 10))
            .input('Agno', sql.Decimal(3, 2), req.body.Agno)
            .input('Faculty', sql.VarChar, req.body.Faculty)
            .input('Department', sql.VarChar, req.body.Department)
            .input('Class', sql.Int, req.body.Class)
            .query(`INSERT INTO Students (StudentID, FirstName, LastName, Password, Agno, Faculty, Department, Class)
                VALUES (@StudentID, @FirstName, @LastName, @Password, @Agno, @Faculty, @Department, @Class)`);
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
            .input('Password', sql.VarChar, bcrypt.hashSync(req.body.Password, 10))
            .input('Agno', sql.Decimal(3, 2), req.body.Agno)
            .input('Faculty', sql.VarChar, req.body.Faculty)
            .input('Department', sql.VarChar, req.body.Department)
            .input('Class', sql.Int, req.body.Classs)
            .query(`UPDATE Students
                SET FirstName = @FirstName, 
                    LastName = @LastName, 
                    Password = @Password, 
                    Agno = @Agno, 
                    Faculty = @Faculty, 
                    Department = @Department, 
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
    createStudent,
    updateStudent,
    deleteStudent
}