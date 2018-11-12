const sequelize = require('../connect');
const {travel} = require('./home');
const {
    articleType,
    article
    } = require('./blog');
const {
    articleList,
    articleTopFive
    } = require('./article');

const travelModel = sequelize.define('travel', travel, {timestamps: false});
const typesModel = sequelize.define('label', articleType, {timestamps: false});
const createArticleModel = sequelize.define('article', article, {timestamps: false});
const articleModel = sequelize.define('article', articleList, {timestamps: false});
const topModel = sequelize.define('article', articleTopFive, {timestamps: false});

module.exports = {
    travelModel,
    typesModel,
    createArticleModel,
    articleModel,
    topModel
}