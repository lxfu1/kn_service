const {
    travelModel,
    typesModel,
    createArticleModel,
    articleModel,
    topModel
    } = require('./model');

// 获取首页旅游信息
exports.getTravel = () => {
    return travelModel.findAll();
}

// 获取文章类型
exports.articleTypes = () => {
    return typesModel.findAll();
}

//添加文章
exports.addArticle = (ctx) => {
    var now = Date.now();
    var date = new Date();
    return createArticleModel.create({
        articleId: 'article_' + now,
        type: ctx.type,
        title: ctx.title,
        introduction: ctx.introduction,
        fileUrl: ctx.fileUrl || '',
        detail: ctx.detail,
        createTime: date.toLocaleString(),
        updateTime: date.toLocaleString()
    });
}

//文章总量
exports.getCount = () => {
    return articleModel.count();
}

//文章查询
exports.getArticles = (page, size) => {
    return articleModel.findAll({
        limit: size * 1,
        offset: (page - 1) * size,
        order: [['updateTime', 'desc']]
    });
}

//文章详情
exports.getArticleDetail = (articleId) => {
    let res = articleModel.findOne({
        where: {
            articleId: articleId
        },
        limit: 1
    });
    return res;
}

//修改文章访问量
exports.updateScans = (articleId, scans) => {
    articleModel.update({
        scans: scans
    },{
        where: {
            articleId: articleId
        }
    });
}

// 阅读量统计
exports.getTopFive = () => {
    return topModel.findAll({
        limit: 5,
        order: [['scans', 'desc']]
    });
}