const dbModel = require('../../db');
const svgCaptcha = require('svg-captcha');
const {jsonMiddle, getUrl} = require('../../utils');

const imgCode = async (ctx, next) => {
    const captcha = svgCaptcha.create({
        width: 117,
        height: 40
    });
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(captcha);
};

const userInfo = async (ctx, next) => {
    const crypto = require('crypto');
    const md5 = crypto.createHash("md5");
    let username = ctx.request.body.username;
    let password = md5.update(ctx.request.body.password).digest('hex');
    var res;
    await dbModel.getUserInfo(username).then(result => {
        if(!result || result.password !== password){
            res = jsonMiddle("", 401, "用户名或密码错误");
        }else{
            ctx.cookies.set('token', Date.now() + result.get('userId'), {maxAge: 0.5 * 60 * 60 * 1000});
            res = jsonMiddle(result);
        }
    })
    //ctx.response.type = "application/json";
    ctx.response.body = res;
};

const logout = async (ctx, next) => {
    ctx.cookies.set('token', null, {expires: new Date('1970-01-01')});
    ctx.response.body = jsonMiddle('退出成功');
};

module.exports = {
    imgCode,
    userInfo,
    logout
};