const dbModel = require('../../db');
const json = require('koa-json');
const svgCaptcha = require('svg-captcha');
const {
    jsonMiddle,
    getUrl,
    sendEmail,
    isPhone,
    productCode
    } = require('../../utils');

const imgCode = async (ctx, next) => {
    const captcha = svgCaptcha.create({
        width: 117,
        height: 40
    });
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(captcha);
};

const login = async (ctx, next) => {
    const crypto = require('crypto');
    const md5 = crypto.createHash("md5");
    let phone = ctx.request.body.username;
    let password = md5.update(ctx.request.body.password).digest('hex');
    var res;
    await dbModel.getUserInfo(phone).then(result => {
        if (!result || result.password !== password) {
            res = jsonMiddle("", 401, "用户名或密码错误");
        } else {
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

/**
 * 推荐用户
 * */
const recommendUser = async (ctx, next) => {
    let res;
    await dbModel.getRecommendUser().then(result => {
        res = result;
    })
    ctx.response.body = jsonMiddle(res);
}

/**
 * 获取短信验证码
 * */
const getPhoneCode = async (ctx, next) => {
    let phone = ctx.params.phone;
    if (isPhone(phone)) {
        let codeKey = phone + Date.now();
        let code = productCode(9999, 1000);
        sendEmail(code, phone);
        redisClient.set(codeKey, 1);
        redisClient.expire(codeKey, 300);
        ctx.response.body = jsonMiddle({
            codeId: codeKey
        });
    } else {
        ctx.response.body = jsonMiddle("", 400, "电话格式不正确");
    }
}

/**
 * 注册
 * */
const registerUser = async (ctx, next) => {
    let {username, phone, messageCode, password, codeId} = ctx.request.body;
    if (!username) {
        ctx.response.body = jsonMiddle("", 400, "用户名不能为空");
    }
    if (!isPhone(phone)) {
        ctx.response.body = jsonMiddle("", 400, "电话格式不正确");
    }
    if (!password) {
        ctx.response.body = jsonMiddle("", 400, "密码不能为空");
    }
    await redisClient.get(codeId, (err, reply)=> {
        if (reply !== messageCode) {
            ctx.response.body = jsonMiddle("", 400, "短信验证码错误");
        }
        redisClient.expire(codeId, 1);
    })
    const crypto = require('crypto');
    const md5 = crypto.createHash("md5");
    password = md5.update(password).digest('hex');
    await dbModel.addUser({phone, username, password}).then(result => {
        ctx.response.body = jsonMiddle(result);
    })
}

module.exports = {
    imgCode,
    login,
    logout,
    recommendUser,
    getPhoneCode,
    registerUser
};