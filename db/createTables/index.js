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
    headUrl: Sequelize.STRING,
    createTime: Sequelize.DATE
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

// 搜索历史表
const history = {
    searchId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    keyword: Sequelize.STRING,
    type: Sequelize.STRING,
    searchTime: Sequelize.DATE,
    counts: Sequelize.INTEGER
}

const users = sequelize.define('user', user, {timestamps: false});
const labels = sequelize.define('label', label, {timestamps: false});
const articles = sequelize.define('article', article, {timestamps: false});
const comments = sequelize.define('comment', comment, {timestamps: false});
const histories = sequelize.define('history', history, {timestamps: false});

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
    },
    {
        tableName: histories,
        tableData: []
    }
];

/**
 * 开始创建表
 */
const createTables = (() => {
    loopCreateData.forEach(item => {
        item.tableName.sync({force: true}).then(res => {
            item.tableData.forEach(inner => {
                item.tableName.create(inner);
            })
        })
    })
    console.log('创建成功');
})();

module.exports = createTables;
