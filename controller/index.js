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
    topFiveList,
    search,
    searchHistory,
    searchByTime
    } = require('./article');

// 登录注册
const {
    imgCode,
    userInfo,
    logout,
    recommendUser
    } = require('./login');

module.exports = {
    'GET /': index,
    'GET /kn/travel': travel,
    'GET /kn/articleTypes': articleTypes,
    'POST /kn/addArticle': createArticle,
    'POST /kn/upload': uploadArticleFile,
    'GET /kn/articleList': articleList,
    'GET /kn/searchByTime': searchByTime,
    'GET /kn/search': search,
    'GET /kn/recommendAuthor': recommendUser,
    'GET /kn/searchHistory': searchHistory,
    'GET /kn/articleTopFive': topFiveList,
    'GET /kn/getArticleDetail/:id': articleDetail,
    'GET /kn/getImgCode': imgCode,
    'POST /kn/login': userInfo,
    'GET /kn/logout': logout,
};