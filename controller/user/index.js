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

/**
 * 登录
 */
const login = async (ctx, next) => {
    let phone = ctx.request.body.username;
    let password = MD5(ctx.request.body.password);
    var res;
    await dbModel.getUserInfo(phone).then(result => {
        if (!result || result.password !== password) {
            res = jsonMiddle("", 401, "用户名或密码错误");
        } else {
            let checked = ctx.request.body.checked;
            ctx.cookies.set("token", result.get("userId"), {
                maxAge: checked ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000
            });
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
 * 获取用户信息
 */
const authorInfo = async (ctx, next) => {
    let userId = ctx.params.userId && ctx.params.userId !== "undefined" ? ctx.params.userId : ctx.cookies.get("token");
    let res;
    await dbModel.getAuthorInfo(userId).then(result => {
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
        let code = productCode(9999, 1000);
        sendEmail(code, phone);
        redisClient.set(phone, String(code));
        redisClient.expire(phone, 300);
        ctx.response.body = jsonMiddle("验证码已发送");
    } else {
        ctx.response.body = jsonMiddle("", 400, "电话格式不正确");
    }
};

/**
 * 注册
 * */
const registerUser = async (ctx, next) => {
    let { username, phone, messageCode, password } = ctx.request.body;
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
    let existCode = await getRedisCode(phone);
    if (existCode !== messageCode) {
        ctx.response.body = jsonMiddle("", 400, "短信验证码错误");
        return;
    }
    redisClient.expire(phone, 1);
    password = MD5(password);
    await dbModel.addUser({ phone, username, password }).then(result => {
        ctx.response.body = jsonMiddle(result);
    });
};

/**
 * 密码找回
 * */
const findPassword = async (ctx, next) => {
    let { phone, phonecode, password } = ctx.request.body;
    if (!isPhone(phone)) {
        ctx.response.body = jsonMiddle("", 400, "电话格式不正确");
        return;
    }
    if (!password) {
        ctx.response.body = jsonMiddle("", 400, "密码不能为空");
        return;
    }
    let existCode = await getRedisCode(phone);
    if (existCode !== phonecode) {
        ctx.response.body = jsonMiddle("", 400, "短信验证码错误");
        return;
    }
    redisClient.expire(phone, 1);
    password = MD5(password);
    await dbModel.findPassword(phone, password).then(result => {
        ctx.response.body = jsonMiddle("找回成功");
    });
};

/**
 * redis大坑
 * 竟然是异步的，MMP
 */
function getRedisCode(phone) {
    return new Promise((resolve, reject) => {
        redisClient.get(phone, (err, reply) => {
            resolve(reply);
        });
    });
}

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

/**
 * 根据用户信息获取关注用户
 */
const attentionUser = async (ctx, next) => {
    let { page, size, type, userId } = getUrl(ctx.request.url);
    const user = userId !== "undefined" ? userId : ctx.cookies.get("token");
    if (!user) {
        ctx.response.body = jsonMiddle("", 401, "权限不足");
        return;
    }
    let followedUser;
    await dbModel.getFollowedUser(user).then(result => {
        followedUser = type === "attention" ? result.get("followedUser") : result.get("follower");
    });
    if (!followedUser) {
        ctx.response.body = jsonMiddle({ count: 0, rows: [] });
        return;
    }
    let res;
    await dbModel.getAttentionUser(followedUser.split("&"), page, size).then(result => {
        res = result;
    });
    ctx.response.body = jsonMiddle(res);
};

/**
 * 更新用户信息
 */
const updatePersonalInfo = async (ctx, next) => {
    let params = ctx.request.body;
    const userId = ctx.cookies.get("token");
    if (!userId) {
        ctx.response.body = jsonMiddle("", 401, "权限不足");
        return;
    }
    if (!params.username) {
        ctx.response.body = jsonMiddle("", 400, "昵称不能为空");
        return;
    }
    if (ctx.request.files.file) {
        await dbModel.getUser(userId, true);
        params.headUrl = ctx.request.files.file.path.replace(/\\/g, "/").split("kn_service")[1];
    }
    params.userId = userId;
    let res;
    await dbModel.updatePersonalInfo(params).then(result => {
        res = "更新成功";
    });
    ctx.response.body = jsonMiddle(res);
};

module.exports = {
    imgCode,
    login,
    logout,
    recommendUser,
    getPhoneCode,
    registerUser,
    modifyPassword,
    attentionUser,
    findPassword,
    authorInfo,
    updatePersonalInfo
};
