const dbModel = require('../../db');
const {jsonMiddle, getUrl} = require('../../utils');

const articleList = async (ctx, next) => {
    let {page, size} = getUrl(ctx.request.url);
    let res;
    await dbModel.getArticles(page, size).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

const articleDetail = async (ctx, next) => {
    let res;
    await dbModel.getArticleDetail(ctx.params.id).then(result => {
        res =result;
    });
    dbModel.updateScans(ctx.params.id, res.scans + 1 || 1);
    ctx.response.body = jsonMiddle(res || {});
};

const topFiveList = async (ctx, next) => {
    let res = {};
    await dbModel.getTopFive().then(result => {
        res.rows = result;
    });
    ctx.response.body = jsonMiddle(res);
};

const search = async (ctx, next) => {
    let {keyword, page, size, type} = getUrl(ctx.request.url);
    let res = {};
    await dbModel.searchArticle(keyword, page, size, type).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

const searchHistory = async (ctx, next) => {
    let {page, size} = getUrl(ctx.request.url);
    let res = {};
    await dbModel.getHistory(page, size).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
}

const searchByTime = async (ctx, next) => {
    let {page, size, type} = getUrl(ctx.request.url);
    let res = {};
    await dbModel.searchArticleByTime(page, size, type).then(result => {
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
    searchByTime
};