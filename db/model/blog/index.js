const Sequelize = require('sequelize');

// 文章类型
const articleType = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    type: Sequelize.STRING(200),
    text: Sequelize.STRING(200)
};

// 文章模型
const article = {
    articleId: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        autoIncrement: true
    },
    type: Sequelize.STRING(20),
    title: Sequelize.STRING(200),
    introduction: Sequelize.STRING(500),
    fileUrl: Sequelize.STRING(200),
    detail: Sequelize.TEXT,
    createTime:Sequelize.DATE ,
    updateTime: Sequelize.DATE
};
module.exports = {
    articleType,
    article
};
