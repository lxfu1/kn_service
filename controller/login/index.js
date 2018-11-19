const dbModel = require("../../db");
const json = require("koa-json");
const svgCaptcha = require("svg-captcha");
const { jsonMiddle, getUrl, sendEmail, isPhone, productCode, MD5 } = require("../../utils");

const imgCode = async (ctx, next) => {
    const captcha = svgCaptcha.create({
        width: 117,
        height: 40
    });
    ctx.response.type = "application/json";
    ctx.response.body = jsonMiddle(captcha);
};

const login = async (ctx, next) => {
    let phone = ctx.request.body.username;
    let password = MD5(ctx.request.body.password);
    var res;
    await dbModel.getUserInfo(phone).then(result => {
        if (!result || result.password !== password) {
            res = jsonMiddle("", 401, "用户名或密码错误");
        } else {
            ctx.cookies.set("token", result.get("userId"), { maxAge: 0.5 * 60 * 60 * 1000 });
            res = jsonMiddle(result);
        }
    });
    //ctx.response.type = "application/json";
    ctx.response.body = res;
};

const logout = async (ctx, next) => {
    ctx.cookies.set("token", null, { expires: new Date("1970-01-01") });
    ctx.response.body = jsonMiddle("退出成功");
};

/**
 * 推荐用户
 * */
const recommendUser = async (ctx, next) => {
    let userId = ctx.cookies.get("token");
    let res;
    await dbModel.getRecommendUser(userId).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

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
};

/**
 * 注册
 * */
const registerUser = async (ctx, next) => {
    let { username, phone, messageCode, password, codeId } = ctx.request.body;
    if (!username) {
        ctx.response.body = jsonMiddle("", 400, "用户名不能为空");
        return;
    }
    if (!isPhone(phone)) {
        ctx.response.body = jsonMiddle("", 400, "电话格式不正确");
        return;
    }
    if (!password) {
        ctx.response.body = jsonMiddle("", 400, "密码不能为空");
        return;
    }
    await redisClient.get(codeId, (err, reply) => {
        if (reply !== messageCode) {
            ctx.response.body = jsonMiddle("", 400, "短信验证码错误");
            return;
        }
        redisClient.expire(codeId, 1);
    });
    password = MD5(password);
    await dbModel.addUser({ phone, username, password }).then(result => {
        ctx.response.body = jsonMiddle(result);
    });
};

/**
 * 密码修改
 * */
const modifyPassword = async (ctx, next) => {
    let { oldPassword, newPassword } = ctx.request.body;
    let userId = ctx.cookies.get("token");
    if (!userId) {
        ctx.response.body = jsonMiddle("", 401, "权限不足");
        return;
    }
    if (!oldPassword) {
        ctx.response.body = jsonMiddle("", 400, "旧密码不能为空");
        return;
    }
    if (!newPassword) {
        ctx.response.body = jsonMiddle("", 400, "新密码不能为空");
        return;
    }
    const oldPw = MD5(oldPassword);
    let checkPassword;
    await dbModel.getUser(userId).then(result => {
        checkPassword = result.get("password");
    });
    if (oldPw !== checkPassword) {
        ctx.response.body = jsonMiddle("", 400, "旧密码不正确");
        return;
    }
    newPassword = MD5(newPassword);
    await dbModel.modifyPassword(userId, newPassword).then(result => {
        ctx.response.body = jsonMiddle("修改成功");
    });
};

module.exports = {
    imgCode,
    login,
    logout,
    recommendUser,
    getPhoneCode,
    registerUser,
    modifyPassword
};
