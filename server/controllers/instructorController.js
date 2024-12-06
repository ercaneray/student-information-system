const sql = require('mssql');
const config = require('../config/sqlconfig.js');
const bcrypt = require('bcrypt');

// GET all student
const getAllInstructors = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM Instructors');
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
            .input('Password', sql.VarChar, bcrypt.hashSync(req.body.Password, 10))
            .query(`INSERT INTO Instructors (InstructorID, FirstName, LastName, Password)
                VALUES (@InstructorID, @FirstName, @LastName, @Password)`);
        const sanitizedInstructors = result.recordset.map(instructor => {
            delete instructor.Password; // Şifre alanını kaldır
            return instructor;
        });
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
            .input('Password', sql.VarChar, bcrypt.hashSync(req.body.Password, 10))
            .query(`UPDATE Instructors
                SET FirstName = @FirstName, 
                    LastName = @LastName, 
                    Password = @Password, 
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

module.exports = {
    getAllInstructors,
    getInstructorByID,
    createInstructor,
    updateInstructor,
    deleteInstructor
}