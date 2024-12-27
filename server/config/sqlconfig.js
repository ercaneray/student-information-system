// Sql server bağlantı ayarları

const config = {
    server: 'localhost',       // sunucu adı
    database: 'db_obs',   // veritabanı adı
    options: {
        trustServerCertificate: true
    },
    authentication: {
        type: 'default', // auth türü
        options: {
            userName: 'sa', // kullanıcı adı
            password: 'eray1533' // şifre
        }
    }
};

module.exports = config;