const multer = require('koa-multer');

//配置
const storage = multer.diskStorage({
    //文件保存路径
    destination: function (req,file,cb) {
        cb(null,'./static/articleFile')
    },
    filename: function (req,file,cb){
        var fileFormat = (file.originalname).split(".");
        console.log(file);
        console.log(cb);
        cb(null,fileFormat[0] + "." + fileFormat[fileFormat.length - 1]);
    }
})
const upload = multer({storage:storage});

module.exports = upload;
