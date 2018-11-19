const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const { userModel, labelModel, articleModel, commentModel, historyModel, attentionModel } = require("./model");

/**
 * 获取文章类型
 * limit: 是否有限制
 * 最多返回200条
 * */
exports.articleTypes = limit => {
    return labelModel.findAll({
        limit: limit ? parseInt(limit) : 200
    });
};

//添加文章
exports.addArticle = ctx => {
    var now = Date.now();
    var date = new Date();
    addUserCount(ctx.userId);
    return articleModel.create({
        articleId: "article_" + now,
        title: ctx.title,
        introduction: ctx.introduction,
        fileUrl: ctx.fileUrl || "",
        detail: ctx.detail,
        userId: ctx.userId,
        labelId: ctx.type,
        createTime: date.toLocaleString(),
        updateTime: date.toLocaleString()
    });
};

/**
 * 文章列表查询
 * */
exports.getArticles = (page, size) => {
    return articleModel.findAndCountAll({
        limit: size * 1,
        offset: (page - 1) * size,
        order: [["updateTime", "desc"]],
        include: [
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
};

//文章详情
exports.getArticleDetail = articleId => {
    let res = articleModel.findOne({
        where: {
            articleId: articleId
        },
        limit: 1,
        include: [
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
};

/**
 * 文章检索
 * 文章标题
 * */
exports.searchArticleByTitle = (keyword, page, size, type) => {
    createHistory(keyword, type);
    let res = articleModel.findAndCountAll({
        where: {
            [Op.or]: [
                {
                    title: {
                        [Op.like]: `%${keyword}%`
                    }
                }
            ]
        },
        limit: size * 1,
        offset: (page - 1) * size,
        include: [
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
};

/**
 * 文章检索
 * 文章类型
 * */
exports.searchArticleByType = (labelId, page, size, keyword) => {
    createHistory(keyword, labelId);
    let res = articleModel.findAndCountAll({
        where: {
            labelId: labelId
        },
        limit: size * 1,
        offset: (page - 1) * size,
        include: [
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
};

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
        order: [["createTime", "desc"]],
        limit: size * 1,
        offset: (page - 1) * size,
        include: [
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
};

//修改文章访问量
exports.updateScans = model => {
    model.update({
        scans: model.scans + 1
    });
};

// 阅读量统计
exports.getTopFive = () => {
    return articleModel.findAll({
        limit: 5,
        order: [["scans", "desc"]]
    });
};

// 用户信息查询
exports.getUserInfo = phone => {
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
exports.getRecommendUser = userId => {
    console.log(userId);
    return userModel.findAll({
        limit: 6,
        offset: 0,
        order: [["articleCount", "desc"]],
        where: {
            userId: {
                [Op.ne]: userId ? userId : ""
            }
        },
        include: [
            {
                model: attentionModel,
                required: false
            }
        ]
    });
};

/**
 * 添加用户
 * */
exports.addUser = params => {
    return userModel.create({
        userId: "yd_" + Date.now(),
        username: params.username,
        password: params.password,
        phone: params.phone,
        createTime: new Date().toDateString()
    });
};

/**
 * 添加文章类型
 * */
exports.addLabels = (labelName, userId) => {
    return labelModel.create({
        labelId: "label_" + Date.now(),
        type: "type_" + userId,
        text: labelName
    });
};

/**
 * 获取历史
 * */
exports.getHistory = (page, size) => {
    return historyModel.findAndCountAll({
        limit: size * 1,
        offset: (page - 1) * size,
        order: [["counts", "desc"]]
    });
};

/**
 * 密码修改
 */
exports.modifyPassword = (userId, password) => {
    return userModel.update(
        {
            password: password
        },
        {
            where: {
                userId: userId
            }
        }
    );
};

/**
 * 查询用户信息
 */
exports.getUser = userId => {
    return userModel.findOne({
        where: {
            userId: userId
        }
    });
};

/**
 * 关注
 * @param(userId):当前用户
 * @param(attentionedId):被关注用户
 * @param(status):1表示关注， 2表示取消关注
 * 维护followedUser：关注了谁
 * */
exports.addAttention = (userId, attentionedId, status) => {
    return attentionModel
        .findOrCreate({
            where: {
                attentionId: userId
            },
            defaults: {
                attentionId: userId,
                followedUser: attentionedId, // 关注了谁
                follower: "", // 谁关注了我
                createAt: Date.now().toLocaleDateString,
                updateAt: Date.now().toLocaleDateString
            }
        })
        .then(res => {
            if (!res[1]) {
                if (status === "1") {
                    res[0].update({
                        followedUser: res[0].followedUser + "&" + attentionedId,
                        updateAt: Date.now().toLocaleDateString
                    });
                } else {
                    let existFollowedUser = res[0].followedUser.split("&");
                    existFollowedUser.splice(existFollowedUser.indexOf(attentionedId), 1);
                    res[0].update({
                        followedUser: existFollowedUser.join("&"),
                        updateAt: Date.now().toLocaleDateString
                    });
                }
            }
        });
};

/**
 * 关注
 * @param(userId):当前用户
 * @param(attentionedId):被关注用户
 * @param(status):1表示关注， 2表示取消关注
 * 维护follower：谁关注了我
 * */
exports.syncAttention = (userId, attentionedId, status) => {
    attentionModel
        .findOrCreate({
            where: {
                attentionId: attentionedId
            },
            defaults: {
                attentionId: attentionedId,
                followedUser: "", // 关注了谁
                follower: userId, // 谁关注了我
                createAt: Date.now().toLocaleDateString,
                updateAt: Date.now().toLocaleDateString
            }
        })
        .then(res => {
            if (!res[1]) {
                if (status === "1") {
                    res[0].update({
                        follower: res[0].follower + "&" + userId,
                        updateAt: Date.now().toLocaleDateString
                    });
                } else {
                    let existFollower = res[0].follower.split("&");
                    existFollower.splice(existFollower.indexOf(userId), 1);
                    res[0].update({
                        follower: existFollower.join("&"),
                        updateAt: Date.now().toLocaleDateString
                    });
                }
            }
        });
};

/**
 * 搜索历史
 * 内部调用
 * 如果存在则加1，否则先添加记录
 */
const createHistory = (keyword, type) => {
    historyModel
        .findOne({
            where: {
                keyword: keyword,
                type: type
            }
        })
        .then(res => {
            if (res) {
                res.update({
                    counts: res.counts + 1
                });
            } else {
                historyModel.create({
                    searchId: "hs_" + Date.now(),
                    type: type,
                    keyword: keyword,
                    counts: 1,
                    searchTime: new Date().toLocaleDateString()
                });
            }
        });
};

/**
 * 内部调用
 * 更新用户发文数量
 */
const addUserCount = userId => {
    userModel
        .findOne({
            where: {
                userId: userId
            }
        })
        .then(res => {
            res.update({
                articleCount: res.articleCount + 1
            });
        });
};

//-----------------后台管理系统开始------------------------
/**
 * 文章列表查询
 * */
exports.getArticlesAdmin = (page, size, title, sortMethod) => {
    return articleModel.findAndCountAll({
        limit: size * 1,
        offset: (page - 1) * size,
        order: [["updateTime", sortMethod ? sortMethod : "desc"]],
        where: {
            title: {
                [Op.like]: `%${title}%`
            }
        },
        include: [
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
};

/**
 * 文章详情
 */
exports.getArticleDetailAdmin = articleId => {
    let res = articleModel.findOne({
        where: {
            articleId: articleId
        },
        limit: 1,
        include: [
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
};

/**
 * 更新文章
 */
exports.updateArticleAdmin = params => {
    var date = new Date();
    return articleModel.update(
        {
            title: params.title,
            introduction: params.introduction,
            fileUrl: params.fileUrl || "",
            detail: JSON.stringify(params.detail),
            labelId: params.type,
            updateTime: date.toLocaleString()
        },
        {
            where: {
                articleId: params.articleId
            }
        }
    );
};

/**
 * 删除文章
 */
exports.deleteArticleAdmin = articleId => {
    return articleModel.destroy({
        where: {
            articleId: articleId
        }
    });
};

//----------------后台管理系统结束----------------------------
