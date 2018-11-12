const Sequelize = require('sequelize');
const dbConfig = require('../../config/dbconfig');

// sequelize 封装了查询语句
var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

module.exports = sequelize;