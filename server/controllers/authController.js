const sql = require('mssql');
const config = require('../config/sqlconfig.js');
const generateJWTToken = require('../utils/generateJWTToken');
// Login işlemi için endpoint
const login = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('UserID', sql.Int, req.body.UserID)
            .execute('sp_FindUserInTables') // Buradaki sp'm ile kullanıcıyı bütün tablolarda arıyorum. Ve one göre girişe izin veriyorum.
        if (!result.recordset)
            return res.status(404).send('User not found');
        else {
            if (req.body.Password === result.recordset[0].Password) {
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
            .execute('sp_FindUserInTables') // Burada da kullanıcı hala veritabanında var mı diye kontrol ediyorum.
        const user = result.recordset[0];
        if (user)
            return res.status(200).json(user);
        else
            return res.status(404).send('User not found');
    } catch (error) {
        res.status(500).send('Internal server error');
        console.error(error);
    }
}

module.exports = { login, logout, checkAuth };