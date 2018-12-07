/**
 * 入口文件
 * */
const Koa = require("koa");
const path = require("path");
const cors = require("koa-cors");
const json = require("koa-json");
const { templating, staticFiles } = require("./utils");
const staticCache = require("koa-static-cache");
const compress = require("koa-compress");
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
    host: process.env.NODE_ENV === "production" ? "172.16.28.94" : "127.0.0.1",
    port: process.env.NODE_ENV === "production" ? 6379 : 6379
});
// 创建表用的，自执行函数
// require("./db/createTables");
const isDevelopment = process.env.NODE_ENV === "development";
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
 * gizp压缩
 */
const options = { threshold: 2048 };
app.use(compress(options));

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
 * 此处有重大安全漏洞！
 * */
// app.use(staticFiles("/static/", __dirname + "/static/"));
// app.use(staticFiles("/views/", __dirname + "/views/"));
// app.use(
//     staticCache(path.join(__dirname, "views"), {
//         maxAge: 5 * 24 * 60 * 60
//     })
// );
app.use(
    staticCache(path.join(__dirname, "static"), {
        maxAge: 5 * 24 * 60 * 60,
        dynamic: true
    })
);

/**
 * 模板引擎
 * */
app.use(
    templating("static", {
        noCache: !isDevelopment,
        watch: !isDevelopment
    })
);
app.use(Router.routes());

// 捕获所有的异常
app.on("error", (err, ctx) => {
    console.error("server error", err);
});
app.listen(BaseConfig.port);
console.log("启动成功" + BaseConfig.port);
