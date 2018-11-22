// 主页
const { index } = require("./home");

//新增文章
const { articleTypes, createArticle, uploadArticleFile, createLabels } = require("./blog");

// 空闲小写
const {
    articleList,
    articleDetail,
    topFiveList,
    search,
    searchByType,
    searchHistory,
    searchByTime,
    attention,
    searchByPersonal
} = require("./article");

// 登录注册
const {
    imgCode,
    login,
    logout,
    recommendUser,
    getPhoneCode,
    registerUser,
    modifyPassword,
    attentionUser,
    findPassword,
    authorInfo,
    updatePersonalInfo
} = require("./user");

//----------------后台管理系统开始--------------------
const {
    articleList_admin,
    articleDetail_admin,
    updateArticle_admin,
    deleteArticle_admin
} = require("./admin/articleManage");

//----------------后台管理系统结束--------------------
module.exports = {
    "GET /": index,
    "GET /kn/articleTypes": articleTypes,
    "POST /kn/addArticle": createArticle,
    "POST /kn/upload": uploadArticleFile,
    "POST /kn/addLabel": createLabels,
    "POST /kn/modifyPassword": modifyPassword,
    "GET /kn/articleList": articleList,
    "GET /kn/searchByTime": searchByTime,
    "GET /kn/attentionUser": attentionUser,
    "GET /kn/search": search,
    "GET /kn/searchByType": searchByType,
    "GET /kn/searchByPersonal": searchByPersonal,
    "GET /kn/recommendAuthor": recommendUser,
    "GET /kn/searchHistory": searchHistory,
    "GET /kn/articleTopFive": topFiveList,
    "GET /kn/getArticleDetail/:id": articleDetail,
    "GET /kn/getImgCode": imgCode,
    "GET /kn/getAuthorInfo": authorInfo,
    "POST /kn/login": login,
    "GET /kn/logout": logout,
    "GET /kn/getMessageCode/:phone": getPhoneCode,
    "POST /kn/register": registerUser,
    "POST /kn/findPassword": findPassword,
    "GET /kn/attention/:attentionedId/:status": attention,
    "GET /kn/articleListAdmin": articleList_admin,
    "GET /kn/getArticleDetailAdmin/:articleId": articleDetail_admin,
    "PUT /kn/updateArticleAdmin": updateArticle_admin,
    "PUT /kn/updatePersonalInfo": updatePersonalInfo,
    "DELETE /kn/deleteArticleAdmin/:articleId": deleteArticle_admin
};
