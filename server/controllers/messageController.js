const sql = require('mssql');
const config = require('../config/sqlconfig.js');

// Get message by ID
const getMessageByID = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('MessageID', sql.Int, req.params.id)
            .query(`SELECT * FROM Messages WHERE MessageID = @MessageID`);
        if (!result.recordset)
            return res.status(404).send('Message not found');
        else
            console.log(result.recordset);
            return res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error(error);
    }
}

// Delete message by ID
const deleteMessage = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('MessageID', sql.Int, req.params.id)
            .query(`DELETE FROM Messages WHERE MessageID = @MessageID`);
        if (!result.recordset)
            return res.status(404).send('Message not found');
        else
            return res.status(200).send('Message deleted');
    } catch (error) {
        console.error(error);
    }
}



const getMyMessages = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('UserID', sql.Int, req.params.id)
            .execute('sp_getMyMessages')
        if (!result.recordset)
            return res.status(404).send('No messages found');
        else
            return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getMessageByID,
    getMyMessages,
    deleteMessage
};