const Sequelize = require('sequelize');

// 用户登录
const user = {
    userId: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        unique: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    tel: Sequelize.STRING(11),
    headUrl: Sequelize.STRING
};

module.exports = {
    user
};
