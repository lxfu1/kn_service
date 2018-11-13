const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {
    travelModel,
    typesModel,
    createArticleModel,
    articleModel,
    topModel,
    userModel,
    historyModel
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


/**
 * 文章查询
 * 列表查询
 * */
exports.getArticles = (page, size) => {
    return articleModel.findAndCountAll({
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

/**
 * 文章检索
 * 文章标题或文章类型
 * */
exports.searchArticle = (keyword, page, size, type) => {
    createHistory(keyword, type);
    let res = articleModel.findAndCountAll({
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: `%${keyword}%`,
                    }
                },
                {
                    type: {
                        [Op.like]: `%${keyword}%`,
                    }
                }
            ]
        },
        limit: size * 1,
        offset: (page - 1) * size,
    });
    return res;
}

/**
 * 热门文章查询
 * 查询最近7天或者30天访问量
 * */
exports.searchArticleByTime = (page, size, type) => {
    let res = articleModel.findAndCountAll({
        where: {
            createTime: {
                [Op.gt]: new Date(new Date() - (type == 7 ? 7 : 30) * 24 * 60 * 60 * 1000)
            }
        },
        order: [['createTime', 'desc']],
        limit: size * 1,
        offset: (page - 1) * size,
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
};

// 用户信息查询
exports.getUserInfo = (username) => {
    return userModel.findOne({
       where: {
           username: username
       }
    });
};
/**
 * 查询推荐用户
 * 发表文章较多的用户
 * */
exports.getRecommendUser = () => {
    return userModel.findAll({
        limit: 6,
        offset: 0,
        order: [['articles', 'desc']]
    });
};

exports.getHistory = (page, size) => {
    return historyModel.findAndCountAll({
        limit: size * 1,
        offset: (page - 1) * size,
        order: [['counts', 'desc']]
    });
}

/**
 * 内部调用
 * 如果存在则加1，否则先添加记录
 */
const createHistory = (keyword, type) => {
    historyModel.findOne({
        where: {
            keyword: keyword,
            type: type
        }
    }).then(res => {
        if(res){
            historyModel.update({
                counts: res.counts + 1
            },
            {
                where: {
                    keyword: keyword,
                    type: type
                }
            })
        }else{
            historyModel.create({
                searchId: 'hs_' + Date.now(),
                type: type,
                keyword: keyword,
                counts:  1,
                searchTime: new Date().toLocaleDateString()
            })
        }
    });
}
