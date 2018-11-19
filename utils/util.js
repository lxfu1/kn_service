// 获取get请求的参数
const getUrl = url => {
    if (!url) {
        return;
    }
    var res = {};
    if (url.indexOf("?") !== -1) {
        var _url = url.split("?")[1];
        var params = _url.split("&");
        for (let i = 0; i < params.length; i++) {
            var kv = params[i].split("=");
            res[kv[0]] = decodeURI(kv[1]);
        }
    }

    return res;
};

const isPhone = str => {
    const myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
};

/**
 * 产生指定范围的随机验证码
 * max：最大值，
 * min: 最小值
 */
const productCode = (max, min) => {
    return parseInt(Math.random() * (max - min) + min, 10);
};

/**
 * 创建md5
 * */
const MD5 = data => {
    const crypto = require("crypto");
    const md5 = crypto.createHash("md5");
    return md5.update(data).digest("hex");
};

module.exports = {
    getUrl,
    isPhone,
    productCode,
    MD5
};
