const express = require('express');
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const config = require('./sqlconfig.js');

const app = express(); // express uygulaması oluştur
app.use(express.json());
app.use(cors());

// kullanıcı girişi endpointi

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('student_id', sql.Int, username)
            .query('SELECT * FROM students WHERE StudentID= @student_ID');

        if (result.recordset.length === 0) {
            return res.status(400).send('Yanlış kullanıcı adı');
        }

        const user = result.recordset[0];

        console.log(user);


        if (password !== user.Password) {
            return res.status(400).send('Yanlış şifre', password, user.Password);
        }
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Bir hata oluştu');
    }
})

app.listen(5000, () => console.log('Server 5000 portu üzerinde çalışıyor') )
