/**
 * author: kn
 * 创建表
 * */
const { userModel, labelModel, articleModel, commentModel, historyModel, attentionModel } = require("../model");

const loopCreateData = [
    {
        tableName: articleModel,
        tableData: []
    },
    {
        tableName: commentModel,
        tableData: []
    },
    {
        tableName: historyModel,
        tableData: []
    }
];
/**
 * 开始创建表
 * 由于存在外键约束， 不能loop
 */
const createTables = (() => {
    // 关注表
    attentionModel.sync().then(res => {
        // 用户表
        userModel.sync().then(re => {
            // 标签表
            labelModel.sync().then(r => {
                loopCreateData.forEach(item => {
                    item.tableName.sync().then(() => {
                        item.tableData.forEach(inner => {
                            item.tableName.create(inner);
                        });
                    });
                });
            });
        });
    });

    console.log("创建成功");
})();

module.exports = createTables;
