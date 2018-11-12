// 获取get请求的参数
const getUrl = (url) => {
    if(!url){
        return;
    }
    var res = {};
    var _url = url.split('?')[1];
    var params = _url.split('&');
    for(let i = 0; i < params.length; i++){
        var kv = params[i].split('=');
        res[kv[0]] = decodeURI(kv[1]);
    }

    return res;
};

module.exports = {getUrl};