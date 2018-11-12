const dbModel = require('../../db');
const {jsonMiddle} = require('../../utils');

var index = async (ctx, next) => {
    ctx.type = "text/html";
    ctx.render('index.html');
};

var travel = async (ctx, next) => {
    let res;
    await dbModel.getTravel().then(result => {
        res = result;
    });
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(res);
};

module.exports = {
    index,
    travel
};