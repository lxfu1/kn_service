const dbModel = require("../../db");
const { jsonMiddle, getUrl } = require("../../utils");

const articleList = async (ctx, next) => {
    let { page, size } = getUrl(ctx.request.url);
    let res;
    await dbModel.getArticles(page, size).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

/**
 *  文章详情
 */
const articleDetail = async (ctx, next) => {
    let res;
    await dbModel.getArticleDetail(ctx.params.id).then(result => {
        res = result;
    });
    dbModel.updateScans(res);
    ctx.response.body = jsonMiddle(res || {});
};

/**
 *  阅读量前五统计
 */
const topFiveList = async (ctx, next) => {
    let res = {};
    await dbModel.getTopFive().then(result => {
        res.rows = result;
    });
    ctx.response.body = jsonMiddle(res);
};

const search = async (ctx, next) => {
    let { keyword, page, size, type } = getUrl(ctx.request.url);
    let res = {};
    await dbModel.searchArticleByTitle(keyword, page, size, type).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

/**
 * 通过文章类型查询
 * */
const searchByType = async (ctx, next) => {
    let { page, size, labelId, keyword } = getUrl(ctx.request.url);
    let res = {};
    await dbModel.searchArticleByType(labelId, page, size, keyword).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

/**
 * 获取搜索历史
 */
const searchHistory = async (ctx, next) => {
    let { page, size } = getUrl(ctx.request.url);
    let res = {};
    await dbModel.getHistory(page, size).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

const searchByTime = async (ctx, next) => {
    let { page, size, type } = getUrl(ctx.request.url);
    let res = {};
    await dbModel.searchArticleByTime(page, size, type).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

/**
 * 添加关注
 */
const attention = async (ctx, next) => {
    const attentionId = ctx.params.attentionedId;
    const status = ctx.params.status;
    const userId = ctx.cookies.get("token");
    if (!userId) {
        ctx.response.body = jsonMiddle("", 401, "请先登录");
        return;
    }
    if (!attentionId) {
        ctx.response.body = jsonMiddle("", 400, "用户不存在");
        return;
    }
    if (!status) {
        ctx.response.body = jsonMiddle("", 400, "关注状态不能为空");
        return;
    }
    let res;
    await dbModel.addAttention(userId, attentionId, status).then(result => {
        res = "关注成功";
    });
    dbModel.syncAttention(userId, attentionId, status);
    ctx.response.body = jsonMiddle(res);
};

/**
 * 个人中心， 更具用户Id查询文章
 */
const searchByPersonal = async (ctx, next) => {
    let { page, size, userId } = getUrl(ctx.request.url);
    let user = userId !== "undefined" ? userId : ctx.cookies.get("token");
    if (!user) {
        ctx.response.body = jsonMiddle("", 401, "权限不足");
        return;
    }
    let res = {};
    await dbModel.searchArticleByPersonal(page, size, user).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

/**
 * 添加评论
 */
const addComments = async (ctx, next) => {
    const { comments, articleId, replayId } = ctx.request.body;
    const userId = ctx.cookies.get("token");
    if (!userId) {
        ctx.response.body = jsonMiddle("", 401, "请先登录");
        return;
    }
    if (!articleId) {
        ctx.response.body = jsonMiddle("", 200, "文章不存在");
        return;
    }
    if (!comments) {
        ctx.response.body = jsonMiddle("", 400, "评论内容不能为空");
        return;
    }
    ctx.response.body = jsonMiddle("评论成功");
    dbModel.addComments(comments, articleId, replayId, userId);
};
/**
 * 评论列表
 */
const commentsList = async (ctx, next) => {
    const articeId = ctx.params.articeId;
    console.log(articeId);
    if (!articeId || articeId === "undefined") {
        ctx.response.body = jsonMiddle("", 200, "文章不存在");
        return;
    }
    let res = {};
    await dbModel.getCommentsList(articeId).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

module.exports = {
    articleList,
    articleDetail,
    topFiveList,
    search,
    searchHistory,
    searchByTime,
    searchByType,
    attention,
    searchByPersonal,
    addComments,
    commentsList
};
