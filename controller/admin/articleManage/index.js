const dbModel = require("../../../db");
const { jsonMiddle, getUrl } = require("../../../utils");

const articleList_admin = async (ctx, next) => {
    let { page, size, title, sortMehod } = getUrl(ctx.request.url);
    let res;
    await dbModel.getArticlesAdmin(page, size, title, sortMehod).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

/**
 *  文章详情
 */
const articleDetail_admin = async (ctx, next) => {
    let res;
    await dbModel.getArticleDetailAdmin(ctx.params.articleId).then(result => {
        res = result;
    });
    dbModel.updateScans(res);
    ctx.response.body = jsonMiddle(res || {});
};

/**
 *  删除文章
 */
const deleteArticle_admin = async (ctx, next) => {
    let res = {};
    await dbModel.deleteArticleAdmin(ctx.params.articleId).then(result => {
        res.rows = result;
    });
    ctx.response.body = jsonMiddle(res);
};

/**
 *  更新文章
 */
const updateArticle_admin = async (ctx, next) => {
    let params = ctx.request.body;
    if (!params.artilce) {
        ctx.response.body = jsonMiddle("", 400, "没有相关文章");
        return;
    }
    let userId = ctx.cookies.get("token");
    if (!userId) {
        ctx.response.body = jsonMiddle("", 401, "请先登录");
        return;
    }
    if (!params.title) {
        ctx.response.body = jsonMiddle("", 400, "title is required");
        return;
    }
    if (!params.type) {
        ctx.response.body = jsonMiddle("", 400, "type is required");
        return;
    }
    if (ctx.request.files.file) {
        params.fileUrl = ctx.request.files.file.path.replace(/\\/g, "/").split("kn_service")[1];
    }
    let res;
    await dbModel.updateArticleAdmin(params).then(result => {
        res = "更新成功";
    });
    ctx.response.body = jsonMiddle(res);
};

module.exports = {
    articleList_admin,
    articleDetail_admin,
    updateArticle_admin,
    deleteArticle_admin
};
