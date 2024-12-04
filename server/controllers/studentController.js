const sql = require('mssql');
const config = require('../config/sqlconfig.js');

// GET all student

const getAllStudents = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM Students');
        res.status(200).json(result.recordset);
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
        res.status(200).json(result.recordset);
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
            .input('Password', sql.VarChar, req.body.Password)
            .input('Agno', sql.Decimal(3, 2), req.body.Agno)
            .input('Faculty', sql.VarChar, req.body.Faculty)
            .input('Department', sql.VarChar, req.body.Department)
            .input('RoleID', sql.Int, req.body.RoleID)
            .input('Classs', sql.Int, req.body.Classs)
            .query(`INSERT INTO Students (StudentID, FirstName, LastName, Password, Agno, Faculty, Department, RoleID, Classs)
                VALUES (@StudentID, @FirstName, @LastName, @Password, @Agno, @Faculty, @Department, @RoleID, @Classs)`);
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
            .input('Agno', sql.Decimal(3, 2), req.body.Agno)
            .input('Faculty', sql.VarChar, req.body.Faculty)
            .input('Department', sql.VarChar, req.body.Department)
            .input('RoleID', sql.Int, req.body.RoleID)
            .input('Classs', sql.Int, req.body.Classs)
            .query(`UPDATE Students
                SET FirstName = @FirstName, 
                    LastName = @LastName, 
                    Password = @Password, 
                    Agno = @Agno, 
                    Faculty = @Faculty, 
                    Department = @Department, 
                    RoleID = @RoleID, 
                    Classs = @Classs
                WHERE StudentID = @StudentID`
            );
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
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