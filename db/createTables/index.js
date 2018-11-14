/**
 * author: kn
 * 创建表
 * */
const {
    userModel,
    labelModel,
    articleModel,
    commentModel,
    historyModel,
    attentionModel
    } = require('../model');

const loopCreateData = [
    {
        tableName: userModel,
        tableData: []
    },
    {
        tableName: labelModel,
        tableData: []
    },
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
    },
    {
        tableName: attentionModel,
        tableData: []
    }
];
/**
 * 开始创建表
 */
const createTables = (() => {
    loopCreateData.forEach(item => {
        item.tableName.sync().then(res => {
            item.tableData.forEach(inner => {
                item.tableName.create(inner);
            })
        })
    })
    console.log('创建成功');
})();

module.exports = createTables;
