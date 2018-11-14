// 主页
const {
        index,
    } = require('./home');

//新增文章
const {
    articleTypes,
    createArticle,
    uploadArticleFile,
    createLabels
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
    login,
    logout,
    recommendUser,
    getPhoneCode,
    registerUser
    } = require('./login');

module.exports = {
    'GET /': index,
    'GET /kn/articleTypes': articleTypes,
    'POST /kn/addArticle': createArticle,
    'POST /kn/upload': uploadArticleFile,
    'POST /kn/addLabel': createLabels,
    'GET /kn/articleList': articleList,
    'GET /kn/searchByTime': searchByTime,
    'GET /kn/search': search,
    'GET /kn/recommendAuthor': recommendUser,
    'GET /kn/searchHistory': searchHistory,
    'GET /kn/articleTopFive': topFiveList,
    'GET /kn/getArticleDetail/:id': articleDetail,
    'GET /kn/getImgCode': imgCode,
    'POST /kn/login': login,
    'GET /kn/logout': logout,
    'GET /kn/getMessageCode/:phone': getPhoneCode,
    'POST /kn/register': registerUser
};