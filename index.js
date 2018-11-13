/**
 * 入口文件
 * */
const Koa = require('koa');
const path = require('path');
const cors = require('koa-cors');
const json = require('koa-json');
const {templating, staticFiles} = require('./utils');
const views = require('koa-views');
//const bodyParser = require('koa-bodyparser');
// 创建表用的，自执行函数
// require('./db/createTables');
const koaBody = require('koa-body');
const BaseConfig =  require('./config/default-config');
const Router = require('./routers');

const isProduction = process.env.NODE_ENV === 'production';
const app = new Koa();

/**
 * 中间件， 防止服务器挂掉
 * */
app.use(async (ctx,next) => {
    try{
        await next()
    }catch(err){
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            status: err.statusCode || err.status || 500,
            message: err.message
        };
        // 手动释放error事件
        ctx.app.emit('error', err, ctx);
    }
});
/**
 * 解决跨域问题
 * */
app.use(cors());

/**
 * json格式输出到前端
 **/
app.use(json());

/**
 * 处理post请求
 * */
// app.use(bodyParser());
app.use(koaBody({
    multipart: true, // 支持文件上传
    encoding: 'utf-8',
    formidable:{
        uploadDir: path.join(__dirname,'static/upload/'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    },
    onError:function(err){
        console.log('server error', err)
    }
}));

/**
 * 处理静态文件
 * */
app.use(staticFiles('/static/', __dirname + '/static/'));
/**
 * 模板引擎
 * */
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));
app.use(Router.routes());

// 捕获所有的异常
app.on('error', (err, ctx) => {
    console.error('server error', err);
});
app.listen(BaseConfig.port);
