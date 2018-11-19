const templating = require("./template");
const staticFiles = require("./static-file");
const jsonMiddle = require("./jsonMiddle");
const upload = require("./upFile");
const { getUrl, isPhone, productCode, MD5 } = require("./util");
const sendEmail = require("./sendMessage");

module.exports = {
    templating,
    staticFiles,
    jsonMiddle,
    upload,
    getUrl,
    sendEmail,
    isPhone,
    productCode,
    MD5
};
