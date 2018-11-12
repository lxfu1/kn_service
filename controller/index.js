// 主页
const {
        index,
        travel
    } = require('./home');

//新增文章
const {
        articleTypes,
        createArticle,
        uploadArticleFile
    } = require('./blog');

// 空闲小写
const {
        articleList,
        articleDetail,
        topFiveList
    } = require('./article');

// 登录注册
const {
    imgCode,
    } = require('./login');

module.exports = {
    'GET /': index,
    'GET /kn/travel': travel,
    'GET /kn/articleTypes': articleTypes,
    'POST /kn/addArticle': createArticle,
    'POST /kn/upload': uploadArticleFile,
    'GET /kn/articleList': articleList,
    'GET /kn/articleTopFive': topFiveList,
    'GET /kn/getArticleDetail/:id': articleDetail,
    'GET /kn/getImgCode': imgCode
};