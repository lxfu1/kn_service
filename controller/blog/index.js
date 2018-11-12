const dbModel = require('../../db');
const {jsonMiddle} = require('../../utils');

const articleTypes = async (ctx, next) => {
    let res;
    await dbModel.articleTypes().then(result => {
        res = result;
    });
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(res);
};

// 新增文章
const createArticle = async (ctx, next) => {
    let params = ctx.request.body;
    if(!params.title){
        ctx.response.body = jsonMiddle('', 400, 'title is required');
        return;
    }
    if(!params.type){
        ctx.response.body = jsonMiddle('', 400, 'type is required');
        return;
    }
    if(ctx.request.files.file){
        params.fileUrl = (ctx.request.files.file.path).replace(/\\/g, '/').split('kn_service')[1];
    }
    let res;
    await dbModel.addArticle(params).then(result => {
        res = "插入成功";
    });
    ctx.response.body = jsonMiddle(res);
};

const uploadArticleFile  = async (ctx, next) => {
    let data = {
        fileUrl: (ctx.request.files.file.path).replace(/\\/g, '/').split('kn_service')[1]
    }
    ctx.response.body = jsonMiddle(data);
}

module.exports = {
    articleTypes,
    createArticle,
    uploadArticleFile
};