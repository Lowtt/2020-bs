const jwt = require('jsonwebtoken')


// 生成token
const createToken = content => {
    let createTime = Math.floor(Date.now() / 1000)
    let secretOrPrivateKey = 'test' //加密方式
    let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: createTime + 60 * 60 * 100 // 100小时过期
    });
    return token
}

//校验token
const verifyToken = token => {
    let secretOrPrivateKey = 'test' //加密方式
    let res = ''
    try {
        let result = jwt.verify(token, secretOrPrivateKey) || {};
        let {
            exp = 0
        } = result, current = Math.floor(Date.now() / 1000);
        if (current <= exp) {
            res = result.data || {};
        }
    } catch (e) {
        res = 'err';
    }
    return res;
}

module.exports = {
    createToken,
    verifyToken
}