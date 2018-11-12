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

module.exports = {
    imgCode,
};