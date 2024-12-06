const bcrypt = require('bcrypt');
const sql = require('mssql');
const config = require('../config/sqlconfig.js');
const generateJWTToken = require('../utils/generateJWTToken');

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
                generateJWTToken(res, result.recordset[0]);
                return res.status(200).json(result.recordset[0]);
            }
            else {
                return res.status(401).send('Login failed');
            }
        }
    } catch (error) {
        console.error(error);
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).send('Logged out');
}

const checkAuth = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('UserID', sql.Int, req.UserID)
            .execute('sp_FindUserInTables')
        const user = result.recordset[0];
        if (user)
            return res.status(200).json(user);
        else
            return res.status(404).send('User not found');
    } catch (error) {
        console.error(error);
    }
}
module.exports = { login, logout, checkAuth };