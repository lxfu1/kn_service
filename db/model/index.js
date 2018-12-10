/**
 * author: kn
 * 创建表
 * */
const Sequelize = require("sequelize");
const sequelize = require("../connect");

//用户表
const user = {
    userId: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    phone: {
        type: Sequelize.STRING(11),
        unique: true
    },
    headUrl: Sequelize.STRING,
    articleCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    commentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: "commonUser"
    },
    attentionId: {
        type: Sequelize.STRING
    },
    describe: Sequelize.STRING(500),
    createTime: Sequelize.DATE
};

// 标签表
const label = {
    labelId: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    type: Sequelize.STRING,
    text: Sequelize.STRING,
    articleCounts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
};

// 文章表
const article = {
    articleId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    labelId: {
        type: Sequelize.STRING,
        unique: "article_store"
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: "article_store"
    },
    userId: {
        type: Sequelize.STRING,
        unique: "article_store"
    },
    introduction: Sequelize.STRING(500),
    fileUrl: Sequelize.STRING,
    detail: Sequelize.TEXT,
    createTime: Sequelize.DATE,
    updateTime: Sequelize.DATE,
    mk: Sequelize.STRING,
    scans: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    comments: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
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
    userId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    articleId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    replayId: {
        type: Sequelize.STRING
    },
    commentTime: Sequelize.DATE
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
};

// 关注表
const attention = {
    attentionId: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    followedUser: Sequelize.TEXT,
    follower: Sequelize.TEXT,
    createAt: Sequelize.DATE,
    updateAt: Sequelize.DATE
};

const attentionModel = sequelize.define("attention", attention, { timestamps: false });
const userModel = sequelize.define("user", user, { timestamps: false });
const labelModel = sequelize.define("label", label, { timestamps: false });
const articleModel = sequelize.define("article", article, { timestamps: false });
const commentModel = sequelize.define("comment", comment, { timestamps: false });
const historyModel = sequelize.define("history", history, { timestamps: false });

articleModel.belongsTo(userModel, { foreignKey: "userId" });
articleModel.belongsTo(labelModel, { foreignKey: "labelId" });
userModel.belongsTo(attentionModel, { foreignKey: "attentionId" });
commentModel.belongsTo(userModel, { foreignKey: "userId" });

module.exports = {
    userModel,
    labelModel,
    articleModel,
    commentModel,
    historyModel,
    attentionModel
};
