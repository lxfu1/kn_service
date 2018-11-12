const dbModel = require('../../db');
const {jsonMiddle, getUrl} = require('../../utils');

const articleList = async (ctx, next) => {
    let {page, size} = getUrl(ctx.request.url);
    let res = {};
    await dbModel.getCount().then(result => {
        res.total = result || 0;
    });
    await dbModel.getArticles(page, size).then(result => {
        res.list = result;
    });
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(res);
};

const articleDetail = async (ctx, next) => {
    let res;
    await dbModel.getArticleDetail(ctx.params.id).then(result => {
        res =result;
    });
    dbModel.updateScans(ctx.params.id, res.scans + 1 || 1);
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(res || {});
};

const topFiveList = async (ctx, next) => {
    let res = {};
    await dbModel.getTopFive().then(result => {
        res.list = result;
    });
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(res);
};

module.exports = {
    articleList,
    articleDetail,
    topFiveList
};