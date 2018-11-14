const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {
    userModel,
    labelModel,
    articleModel,
    commentModel,
    historyModel,
    attentionModel
    } = require('./model');

/**
 * 获取文章类型
 * limit: 是否有限制
 * 最多返回200条
 * */
exports.articleTypes = (limit) => {
    return labelModel.findAll({
        limit: limit ? parseInt(limit) : 200
    });
}

//添加文章
exports.addArticle = (ctx) => {
    console.log(ctx.type);
    var now = Date.now();
    var date = new Date();
    return articleModel.create({
        articleId: 'article_' + now,
        title: ctx.title,
        introduction: ctx.introduction,
        fileUrl: ctx.fileUrl || '',
        detail: ctx.detail,
        userId: ctx.userId,
        labelId: ctx.type,
        createTime: date.toLocaleString(),
        updateTime: date.toLocaleString()
    });
}

/**
 * 文章列表查询
 * */
exports.getArticles = (page, size) => {
    return articleModel.findAndCountAll({
        limit: size * 1,
        offset: (page - 1) * size,
        order: [['updateTime', 'desc']],
        include:[
            {
                model: userModel,
                required: true
            },
            {
                model: labelModel,
                required: true
            }
        ]
    });
}

//文章详情
exports.getArticleDetail = (articleId) => {
    let res = articleModel.findOne({
        where: {
            articleId: articleId
        },
        limit: 1,
        include:[
            {
                model: userModel,
                required: true
            },
            {
                model: labelModel,
                required: true
            }
        ]
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
                }
            ]
        },
        limit: size * 1,
        offset: (page - 1) * size,
        include:[
            {
                model: userModel,
                required: true
            },
            {
                model: labelModel,
                required: true
            }
        ]
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
        include:[
            {
                model: userModel,
                required: true
            },
            {
                model: labelModel,
                required: true
            }
        ]
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
    return articleModel.findAll({
        limit: 5,
        order: [['scans', 'desc']]
    });
};

// 用户信息查询
exports.getUserInfo = (phone) => {
    return userModel.findOne({
       where: {
           phone: phone
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
        order: [['articleCount', 'desc']]
    });
};

/**
 * 添加用户
 * */
exports.addUser = (params) => {
    return userModel.create(
        {
            userId: 'yd_' + Date.now(),
            username: params.username,
            password: params.password,
            phone: params.phone,
            createTime: new Date().toDateString()
        }
    );
};

/**
 * 添加文章类型
 * */
exports.addLabels = (labelName, userId) => {
    return labelModel.create(
        {
            labelId: 'label_' + Date.now(),
            type: 'type_' + userId,
            text: labelName,
        }
    );
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
