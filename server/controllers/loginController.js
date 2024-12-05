const bcrypt = require('bcrypt');
const sql = require('mssql');
const config = require('../config/sqlconfig.js');

const login = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('UserID', sql.Int, req.body.UserID)
            .execute('sp_FindUserInTables')
        if (!result.recordset)
            return res.status(404).send('User not found');
        else {
            const isPasswordValid = await bcrypt.compare(req.body.Password, result.recordset[0].Password);
            if (isPasswordValid) {
                console.log('Login successful');
                return res.status(200).send('Login successful');
            }
            else {
                console.log('Login failed');
                return res.status(401).send('Login failed');
            }
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = { login };