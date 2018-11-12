const Sequelize = require('sequelize');

// 文章列表
const articleList = {
    articleId: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        unique: true
    },
    type: Sequelize.STRING(20),
    title: Sequelize.STRING(200),
    introduction: Sequelize.STRING(500),
    fileUrl: Sequelize.STRING(200),
    detail: Sequelize.TEXT,
    createTime:Sequelize.BIGINT ,
    updateTime: Sequelize.BIGINT,
    scans:  Sequelize.INTEGER,
    userId: Sequelize.STRING(50),
    comments: Sequelize.INTEGER
};

// 阅读量统计
const articleTopFive = {
    articleId: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    type: Sequelize.STRING(20),
    title: Sequelize.STRING(200),
    scans:  Sequelize.INTEGER,
};

module.exports = {
    articleList,
    articleTopFive
};
