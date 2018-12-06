//数据库配置
const dbConfig = {
    database: "kn",
    username: "root",
    password: process.env.NODE_ENV === "production" ? "root2018@Kn1" : "root",
    port: "3306",
    host: process.env.NODE_ENV === "production" ? "120.79.89.120" : "localhost",
    timeout: 60 * 60 * 1000,
    timezone: "+08:00"
};

module.exports = dbConfig;
