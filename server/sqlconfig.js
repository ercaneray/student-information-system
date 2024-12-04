const config = {
    server: 'localhost',       // sunucu adı
    database: 'db_obs',
    options: {
        trustServerCertificate: true
    },
    authentication: {
        type: 'default', // auth türü
        options: {
            userName: 'sa',
            password: 'eray1533'
        }
    }
};

module.exports = config;