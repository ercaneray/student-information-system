const sql = require('mssql');
const config = require('../config/sqlconfig.js');

// GET all Departments

const getAllDepartments = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request().query(`SELECT * FROM Departments`);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
}

module.exports = { getAllDepartments };