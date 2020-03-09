const express = require('express')
const jwt = require('jsonwebtoken') //token验证
const router = express.Router()
const db = require('../mysql/mysql.js')
const Response = require('../response/response.js')


// 登录接口
router.post('/login', (req, res) => {
    let {
        username,
        password
    } = req.body
    let sql = 'SELECT * FROM bishe.login WHERE username = ?'
    db.sqlQuery(sql, username).then(result => {
        if (result.length) {
            if (result[0].password == password) {
                //生成token
                let content = {
                    name: username
                }
                let secretOrPrivateKey = "test" // 这是加密的key（密钥） 
                let token = jwt.sign(content, secretOrPrivateKey, {
                    expiresIn: 60 * 60 * 100 // 100小时过期
                });
                let obj = {
                    code: 200,
                    username: username,
                    message: '登陆成功!',
                    token: token
                }
                res.json(obj)
            } else {
                let response = new Response('账户或密码错误!', 250)
                res.json(response)
            }
        } else {
            let response = new Response('用户名不存在!', 250)
            res.json(response)
        }



    }).catch(err => {
        res.json({
            status: 250,
            message: err
        })

    })
})
module.exports = router