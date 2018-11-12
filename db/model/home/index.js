const Sequelize = require('sequelize');

// 首页地球旅游信息
const travel = {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    area: Sequelize.STRING(250)
};

module.exports = {
    travel
};
