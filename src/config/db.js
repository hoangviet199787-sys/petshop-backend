const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('PetShopDB', 'username', 'password', {
    host: 'localhost',
    dialect: 'mssql', // Dùng cho SQL Server
    dialectOptions: {
        options: { encrypt: false, trustServerCertificate: true }
    }
});

module.exports = sequelize;