const sql = require('mssql');
const config = require('../config/sqlconfig.js');

// GET ID'ye göre mesaj getirme
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
// DELETE ID'ye göre mesaj silme
const deleteMessage = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('MessageID', sql.Int, req.params.id)
            .query(`DELETE FROM Messages WHERE MessageID = @MessageID`);
        if (result.rowsAffected[0] === 0)
            return res.status(404).send('Message not found');
        else
            return res.status(200).send('Message deleted');
    } catch (error) {
        console.error(error);
    }
}
// GET ID'ye göre kullanıcının mesajlarını getirme
const getUserMessages = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('UserID', sql.Int, req.params.id)
            .execute('sp_GetUserMessages')
        if (!result.recordset)
            return res.status(404).send('No messages found');
        else
            return res.status(200).json(result.recordset);
    } catch (error) {
        console.error(error);
    }
}
// POST Mesaj oluşturma
const createMessage = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('SenderID', sql.Int, req.body.SenderID)
            .input('ReceiverID', sql.Int, req.body.ReceiverID)
            .input('Message', sql.NVarChar, req.body.Message)
            .query(`
                INSERT INTO Messages (SenderID, ReceiverID, Message) 
                OUTPUT INSERTED.MessageID, INSERTED.SenderID, INSERTED.ReceiverID, INSERTED.Message, INSERTED.Date
                VALUES (@SenderID, @ReceiverID, @Message)
            `);

        if (result.recordset.length === 0) {
            return res.status(400).send('Message not created');
        }

        // Yeni mesajın detaylarını döndür
        return res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};
// GET Tüm admin olmayan kullanıcıları getirme
const getAllNonAdminUsers = async (req, res) => {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .execute('sp_GetAllNonAdminUsers'); 

        if (result.recordset.length === 0) {
            return res.status(404).send('No users found');
        }

        return res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send('Internal server error');
    }
};


module.exports = {
    getAllNonAdminUsers,
    getMessageByID,
    getUserMessages,
    deleteMessage,
    createMessage
};