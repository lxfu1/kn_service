/**
 * author: kn
 * 创建表
 * */
const Sequelize = require('sequelize');
const sequelize = require('../connect');
const {
    labelData,
    userData,
    articleData,
    commentData
    } = require('./tableData');

//用户表
const user = {
    userId: {
        type: Sequelize.STRING(20),
        primaryKey: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    tel: Sequelize.STRING(11),
    headUrl: Sequelize.STRING
};

// 标签表
const label = {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type: Sequelize.STRING,
    text: Sequelize.STRING
};

// 文章表
const article = {
    articleId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    introduction: Sequelize.STRING(500),
    fileUrl: Sequelize.STRING,
    detail: Sequelize.TEXT,
    createTime: Sequelize.DATE,
    updateTime: Sequelize.DATE,
    mk: Sequelize.STRING,
    scans: Sequelize.INTEGER,
    userId: Sequelize.STRING,
    comments: Sequelize.INTEGER
};

// 评论表
const comment = {
    commentId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    comments: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sourceUserId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    targetUserId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    articleId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    commentTime: Sequelize.DATE,
};

const users = sequelize.define('user', user, {timeStamp: true});
const labels = sequelize.define('label', label, {timeStamp: true});
const articles = sequelize.define('article', article, {timeStamp: true});
const comments = sequelize.define('comment', comment, {timeStamp: true});

const loopCreateData = [
    {
        tableName: users,
        tableData: userData
    },
    {
        tableName: labels,
        tableData: labelData
    },
    {
        tableName: articles,
        tableData: articleData
    },
    {
        tableName: comments,
        tableData: commentData
    }
];

/**
 * 开始创建表
 */
const createTables = (() => {
    loopCreateData.forEach(item => {
        item.tableName.sync().then(res => {
            item.tableData.forEach(inner => {
                item.tableName.create(inner);
            })
        })
        console.log('创建成功');
    })
})();

module.exports = createTables;
