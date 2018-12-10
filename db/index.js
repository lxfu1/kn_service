const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const path = require("path");
const fs = require("fs");

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
    var fileUrl = ctx.fileUrl ? ctx.fileUrl.substring(7) : "";
    return articleModel.create({
        articleId: "article_" + now,
        title: ctx.title,
        introduction: ctx.introduction,
        fileUrl: fileUrl,
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
 * 根据用户信息匹配文章
 * */
exports.searchArticleByPersonal = (page, size, author) => {
    let res = articleModel.findAndCountAll({
        where: {
            userId: author
        },
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
        order: [["scans", "desc"]],
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
exports.getRecommendUser = (userId, page, size) => {
    if (!page) {
        return userModel.findAll({
            limit: 6,
            offset: 0,
            order: [["articleCount", "desc"]],
            where: {
                userId: {
                    [Op.ne]: userId ? userId : ""
                },
                articleCount: {
                    [Op.gt]: 0
                }
            },
            include: [
                {
                    model: attentionModel,
                    required: false
                }
            ]
        });
    } else {
        return userModel.findAndCountAll({
            limit: size * 1,
            offset: (page - 1) * size,
            order: [["articleCount", "desc"]],
            where: {
                articleCount: {
                    [Op.gt]: 0
                }
            },
            include: [
                {
                    model: attentionModel,
                    required: false
                }
            ]
        });
    }
};

/**
 * 个人中心
 * 获取用户信息
 */
exports.getAuthorInfo = userId => {
    return userModel.findOne({
        where: {
            userId: userId
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
    let onlyId = Date.now();
    return attentionModel
        .create({
            attentionId: "yd_" + onlyId,
            createAt: new Date().toLocaleString()
        })
        .then(res => {
            userModel.create({
                userId: "yd_" + onlyId,
                username: params.username,
                password: params.password,
                attentionId: "yd_" + onlyId,
                phone: params.phone,
                createTime: new Date().toDateString()
            });
        });
};

/**
 * 更新用户信息
 */
exports.updatePersonalInfo = params => {
    var headUrl = params.headUrl ? params.headUrl.substring(7) : "";
    return userModel.update(
        {
            username: params.username,
            describe: params.describe,
            headUrl: headUrl
        },
        {
            where: {
                userId: params.userId
            }
        }
    );
};

/**
 * 根据用户信息获取关注用户
 */
exports.getFollowedUser = userId => {
    return attentionModel.findOne({
        where: {
            attentionId: userId
        }
    });
};
exports.getAttentionUser = (options, page, size) => {
    return userModel.findAndCount({
        where: {
            userId: {
                [Op.in]: options
            }
        },
        limit: size * 1,
        offset: (page - 1) * size
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
 * 密码找回
 */
exports.findPassword = (phone, password) => {
    return userModel.update(
        {
            password: password
        },
        {
            where: {
                phone: phone
            }
        }
    );
};

/**
 * 查询用户信息
 * d: 是否删除用户头像
 */
exports.getUser = (userId, d) => {
    return userModel
        .findOne({
            where: {
                userId: userId
            }
        })
        .then(res => {
            if (d && res.headUrl) {
                deleteFile(res.headUrl);
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
    let d = new Date().toLocaleString();
    return attentionModel
        .find({
            where: {
                attentionId: userId
            }
        })
        .then(res => {
            let followed = "";
            if (status === "1") {
                followed = res.followedUser ? res.followedUser + "&" + attentionedId : attentionedId;
            } else {
                let existFollowedUser = res.followedUser.split("&");
                existFollowedUser.splice(existFollowedUser.indexOf(attentionedId), 1);
                followed = existFollowedUser.join("&");
            }

            res.update({
                followedUser: followed,
                updateAt: d
            });
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
    let d = new Date().toLocaleString();
    attentionModel
        .find({
            where: {
                attentionId: attentionedId
            }
        })
        .then(res => {
            let follower = "";
            if (status === "1") {
                follower = res.follower ? res.follower + "&" + userId : userId;
            } else {
                let existFollower = res.follower.split("&");
                existFollower.splice(existFollower.indexOf(userId), 1);
                follower = existFollower.join("&");
            }
            res.update({
                follower: follower,
                updateAt: d
            });
        });
};

/**
 * 文章评论
 * @param(comments)： 评论内容
 * @param(articleId)：文章Id
 * @param(replayId): 恢复Id
 * @param(userId): 用户Id
 */
exports.addComments = (comments, articleId, replayId, userId) => {
    console.log(comments, replayId);
    commentModel.create({
        commentId: "cm_" + Date.now(),
        comments: comments,
        userId: userId,
        articleId: articleId,
        replayId: replayId || null,
        commentTime: new Date().toLocaleString()
    });
    //更新文章评论数量
    articleModel
        .findOne({
            where: {
                articleId: articleId
            }
        })
        .then(res => {
            res.update({
                comments: res.comments + 1
            });
        });
};

/**
 * 评论列表
 * @param(articleId): 文章Id
 */
exports.getCommentsList = articleId => {
    return commentModel.findAndCountAll({
        where: {
            articleId: articleId
        },
        order: [["commentTime", "desc"]],
        include: [
            {
                model: userModel,
                required: true
            }
        ]
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

/**
 * 删除文章的时候删除图片
 */
const deleteFile = filePath => {
    filePath = "/static" + filePath;
    fs.exists(path.join(__dirname, "..", filePath), function(exists) {
        if (exists) {
            fs.unlink(path.join(__dirname, "..", filePath), err => {
                if (err) {
                    throw err;
                }
                console.log(filePath + "was deleted");
            });
        }
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
    var fileUrl = params.fileUrl ? params.fileUrl.substring(7) : "";
    return articleModel.update(
        {
            title: params.title,
            introduction: params.introduction,
            fileUrl: fileUrl,
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
    return articleModel
        .findOne({
            where: {
                articleId: articleId
            }
        })
        .then(res => {
            deleteFile(res.fileUrl);
            res.destroy();
        });
};

//----------------后台管理系统结束----------------------------
