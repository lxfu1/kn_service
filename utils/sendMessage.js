const fetch = require('node-fetch');

const sendEmail = (code, phone) => {
    const data = {
        appid: '29442',
        to: phone,
        content: `【一点博客】你的短信验证码：${code}，请在5分钟内输入。`,
        signature: '2858503a60f6775ea79b71601bc30caf'
    };
    fetch('https://api.mysubmail.com/message/send.json', {
        method: "post",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": 'application/json',
        }
    }).then(res => {
       return res.json();
    }).then(result => {
        console.log(result);
    })
}

module.exports = sendEmail;