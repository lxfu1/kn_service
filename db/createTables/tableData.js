const crypto = require('crypto');
const md5 = crypto.createHash("md5");

// lables数据
const labelData = [
    {
        type: 'node.js',
        text: 'node.js'
    },
    {
        type: 'qkl',
        text: '区块链'
    },
    {
        type: 'wx',
        text: '小程序'
    },
    {
        type: 'php',
        text: 'php'
    },
    {
        type: 'money',
        text: '理财'
    },
    {
        type: 'foods',
        text: '美食'
    },
    {
        type: 'story',
        text: '故事'
    },
    {
        type: 'travel',
        text: '旅游'
    },
    {
        type: 'html',
        text: 'html'
    },
    {
        type: 'javascript',
        text: 'javascript'
    },
    {
        type: 'react',
        text: 'react'
    },
    {
        type: 'angular',
        text: 'angular'
    },
    {
        type: 'offer',
        text: '面试'
    },
    {
        type: 'three',
        text: 'three.js'
    },
    {
        type: 'mpvue',
        text: 'mpvue'
    },
    {
        type: 'umi',
        text: 'umi'
    },
    {
        type: 'dva',
        text: 'dva'
    }
];

// 用户数据
const userData = [
    {
        userId: 'yduser' + new Date().getTime(),
        username: 'kn',
        password: md5.update('123456').digest("hex"),
        tel: '18302601558',
        headUrl: '',
        articles: 0,
        commented: 0,
        createTime: new Date().toLocaleDateString()
    }
];

// 文章数据
const articleData = [
    {
        articleId: "kn_" + new Date().getTime(),
        type: "node",
        title: "测试数据",
        introduction: "测试数据",
        fileUrl: "",
        detail: "王八蛋李贺",
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        mk: "",
        scans: 0,
        userId: "yduser1541994414695",
        comments: 0
    }
];

// 评论数据
const commentData = [
    {
        commentId: "cm_" + new Date().getTime(),
        comments: "绝世好文",
        sourceUserId: "yduser1541994414695",
        targetUserId: "yduser1541994733725",
        articleId: "kn_1542001279703",
        commentTime: new Date().toLocaleString(),
    }
]

module.exports = {
    labelData,
    userData,
    articleData,
    commentData
}