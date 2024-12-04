const sql = require('mssql');
const config = require('../config/sqlconfig.js');
const e = require('express');

// GET all student

const getAllStudents = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM Students');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(400).send(error, 'An error occured');
    }
};

const getStudentByID = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('SELECT * FROM Students WHERE StudentID = ' + req.params.id)
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(400).send(error, 'An error occured');
    }
}

const createStudent = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('INSERT INTO Students (StudentID, FirstName, LastName, Password, Faculty, Department, Classs) VALUES (' + req.body.StudentID + ', ' + req.body.FirstName + ', ' + req.body.LastName + ', ' + req.body.Password + ', ' + req.body.Faculty + ', ' + req.body.Department + ', ' + req.body.Classs + ')');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(400).send(error, 'An error occured');
    }
}

const updateStudent = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('UPDATE Students SET FirstName = ' + req.body.FirstName + ', LastName = ' + req.body.LastName + ', Password = ' + req.body.Password + ', Faculty = ' + req.body.Faculty + ', Department = ' + req.body.Department + ', Class = ' + req.body.Classs + ' WHERE StudentID = ' + req.params.id);
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(400).send(error);
    }
}

const deleteStudent = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query('DELETE FROM Students WHERE StudentID = ' + req.params.id);
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(400).send(error, 'An error occured');
    }
}

module.exports = {
    getAllStudents,
    getStudentByID,
    createStudent,
    updateStudent,
    deleteStudent
}
