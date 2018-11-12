const sequelize = require('../connect');
const {travel} = require('./home');
const {
    articleType,
    article
    } = require('./blog');
const {
    articleList,
    articleTopFive,
    searchHistory
    } = require('./article');

const {
    user
    } = require('./login');

const travelModel = sequelize.define('travel', travel, {timestamps: false});
const typesModel = sequelize.define('label', articleType, {timestamps: false});
const createArticleModel = sequelize.define('article', article, {timestamps: false});
const articleModel = sequelize.define('article', articleList, {timestamps: false});
const topModel = sequelize.define('article', articleTopFive, {timestamps: false});
const userModel = sequelize.define('user', user, {timestamps: false});
const historyModel = sequelize.define('history', searchHistory, {timestamps: false});

module.exports = {
    travelModel,
    typesModel,
    createArticleModel,
    articleModel,
    topModel,
    userModel,
    historyModel
}