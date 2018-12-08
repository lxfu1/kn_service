//数据库配置
const dbConfig = {
    database: "kn",
    username: "root",
    password: process.env.NODE_ENV === "production" ? "root2018@Kn1" : "root",
    port: "3306",
    host: process.env.NODE_ENV === "production" ? "172.16.28.94" : "localhost",
    timeout: 60 * 60 * 1000,
    timezone: "+08:00"
};

module.exports = dbConfig;
