/**
 * 入口文件
 * */
const Koa = require("koa");
const path = require("path");
const cors = require("koa-cors");
const json = require("koa-json");
const { templating, staticFiles } = require("./utils");
const views = require("koa-views");
const koaBody = require("koa-body");
const myLog = require("koa-sam-log");
const BaseConfig = require("./config/default-config");
const Router = require("./routers");
/**
 * redis服务
 * 需要本地启动
 * */
const redis = require("redis");
const client = redis.createClient({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || 6379
});
// 创建表用的，自执行函数
// require("./db/createTables");
const isProduction = process.env.NODE_ENV === "production";
const app = new Koa();
global.redisClient = client;

/**
 * 中间件， 防止服务器挂掉
 * */
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            status: err.statusCode || err.status || 500,
            message: err.message
        };
        // 手动释放error事件
        ctx.app.emit("error", err, ctx);
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
 * 日志
 */
app.use(
    myLog(
        {
            type: "dateFile", //按日期创建文件，文件名为 filename + pattern
            filename: "logs/",
            pattern: "yyyy-MM-dd.log",
            alwaysIncludePattern: true
        },
        {
            env: app.env, //如果是development则可以同时在控制台中打印
            level: "error" //logger level
        }
    )
);

/**
 * 处理post请求
 * */
// app.use(bodyParser());
app.use(
    koaBody({
        multipart: true, // 支持文件上传
        encoding: "utf-8",
        formidable: {
            uploadDir: path.join(__dirname, "static/upload/"), // 设置文件上传目录
            keepExtensions: true, // 保持文件的后缀
            maxFieldsSize: 2 * 1024 * 1024 // 文件上传大小
        },
        onError: function(err) {
            console.log("server error", err);
        }
    })
);

/**
 * 处理静态文件
 * */
app.use(staticFiles("/static/", __dirname + "/static/"));
/**
 * 模板引擎
 * */
app.use(
    templating("views", {
        noCache: !isProduction,
        watch: !isProduction
    })
);
app.use(Router.routes());

// 捕获所有的异常
app.on("error", (err, ctx) => {
    console.error("server error", err);
});
app.listen(BaseConfig.port);
