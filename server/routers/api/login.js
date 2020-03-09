//登录,注册,修改密码api

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
    let sql = 'SELECT * FROM login WHERE username = ?'
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
                    message: '登录成功!',
                    data: {
                        username: username,
                        token: token
                    }
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

// 修改密码接口
router.post('/changePassword', (req, res) => {
    let {
        username,
        oldPassword,
        newPassword
    } = req.body
    let querySql = 'SELECT * FROM login WHERE username = ?'
    let addSql = 'UPDATE login SET password = ? WHERE username = ?'
    db.sqlQuery(querySql, username).then(result => {
        if (result.length) {
            if (result[0].password == oldPassword) {
                db.sqlQuery(addSql, [newPassword, username]).then(() => {
                    let response = new Response('修改成功!', 200)
                    res.json(response)
                }).catch(err => {
                    let response = new Response(err, 250)
                    res.json(response)
                })
            } else {
                let response = new Response('账户或密码错误!', 250)
                res.json(response)
            }
        } else {
            let response = new Response('修改的用户名不存在!', 250)
            res.json(response)
        }
    }).catch(err => {
        res.json({
            status: 250,
            message: err
        })

    })
})

// 注册接口
router.post('/regUser', (req, res) => {
    let {
        username,
        password
    } = req.body
    let querySql = 'SELECT * FROM login WHERE username = ?'
    let regSql = 'INSERT INTO login (username,password) VALUES (?,?)'
    db.sqlQuery(querySql, username).then(result => {
        if (result.length) {
            let response = new Response('该用户已存在!', 250)
            res.json(response)
        } else {
            db.sqlQuery(regSql, [username, password]).then(() => {
                let response = new Response('注册成功!', 200)
                res.json(response)
            }).catch(err => {
                let response = new Response(err, 250)
                res.json(response)
            })

        }
    }).catch(err => {
        res.json({
            status: 250,
            message: err
        })

    })
})
module.exports = router