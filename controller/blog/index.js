const dbModel = require("../../db");
const { jsonMiddle, getUrl } = require("../../utils");

const articleTypes = async (ctx, next) => {
    let { limit } = getUrl(ctx.request.url);
    let res;
    await dbModel.articleTypes(limit).then(result => {
        res = result;
    });
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(res);
};

/**
 * 新增文章
 */
const createArticle = async (ctx, next) => {
    let params = ctx.request.body;
    let userId = ctx.cookies.get("token");
    if (!userId) {
        ctx.response.body = jsonMiddle("", 401, "请先登录");
        return;
    }
    params.userId = userId;
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
    await dbModel.addArticle(params).then(result => {
        res = "插入成功";
    });
    ctx.response.body = jsonMiddle(res);
};

const uploadArticleFile = async (ctx, next) => {
    let fileUrl = ctx.request.files.file.path.replace(/\\/g, "/").split("kn_service")[1];
    if(fileUrl){
        fileUrl = fileUrl.substring(7)
    }
    let data = {
        fileUrl: fileUrl
    };
    ctx.response.body = jsonMiddle(data);
};

/**
 * 新增文章类型
 */
const createLabels = async (ctx, next) => {
    let { labelName } = ctx.request.body;
    const userId = ctx.cookies.get("token");
    if (!labelName) {
        ctx.response.body = jsonMiddle("", 400, "请输入类型名称");
        return;
    }
    if (!userId) {
        ctx.response.body = jsonMiddle("", 401, "权限不足");
        return;
    }

    let res;
    await dbModel.addLabels(labelName, userId).then(result => {
        res = "添加成功";
    });
    ctx.response.body = jsonMiddle(res);
};

module.exports = {
    articleTypes,
    createArticle,
    uploadArticleFile,
    createLabels
};
