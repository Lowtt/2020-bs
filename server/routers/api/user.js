//用户信息

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

//查找用户
router.post('/queryUser', (req, res) => {
    let {
        userName,
        pageNum,
        pageSize
    } = req.body
    let querySql = 'SELECT username,create_at as createAt,user_id as id,password FROM login '
    let totalSql = 'SELECT COUNT(*) as total FROM login '
    if (userName) {
        querySql += `WHERE username like '%${userName}%'`
        totalSql += `WHERE username like '%${userName}%'`
    } 
    querySql+=` ORDER BY createAt DESC LIMIT ${(pageNum-1)*pageSize},${pageSize}`
    db.sqlQuery(querySql).then(result => {
        db.sqlQuery(totalSql).then(res1 => {
            let data = {
                data: result,
                pageNum: pageNum,
                pageSize: pageSize,
                total:res1[0].total
            }
            let response = new Response('查询成功!', 200, data)
            res.json(response)
        }).catch(err => {
            res.json({
                code: 250,
                message: err.code
            })
        })
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

// 修改用户名
router.post('/updateUser', (req, res) => {
    let {
        userName,
        passWord,
        id
    } = req.body
    let querySql = 'SELECT * FROM login'
    let queryFunction = () => {
        let addSql = 'UPDATE login SET password = ?,username = ? WHERE user_id = ?'
        db.sqlQuery(addSql, [passWord, userName, id]).then(() => {
            let response = new Response('修改成功!', 200)
            res.json(response)
        }).catch(err => {
            let response = new Response(err.code, 250)
            res.json(response)
        })
    }
    db.sqlQuery(querySql).then(result => {
        if (result.length) {
            let arr = result.filter(item => item.user_id != id && item.username == userName)
            if (arr.length) {
                let response = new Response('用户名已存在!', 250)
                res.json(response)
                return
            }
            queryFunction()
        } else {
            queryFunction()
        }
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })

    })
})

// 新增用户
router.post('/createUser', (req, res) => {
    let {
        userName,
        passWord
    } = req.body
    let querySql = 'SELECT * FROM login WHERE username = ?'
    let regSql = 'INSERT INTO login (username,password) VALUES (?,?)'
    db.sqlQuery(querySql, [userName]).then(result => {
        if (result.length) {
            let response = new Response('该用户已存在!', 250)
            res.json(response)
        } else {
            db.sqlQuery(regSql, [userName, passWord]).then(() => {
                let response = new Response('新增成功!', 200)
                res.json(response)
            }).catch(err => {
                let response = new Response(err.code, 250)
                res.json(response)
            })

        }
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })

    })
})

//删除用户
router.post('/deleteUser', (req, res) => {
    let {
        id
    } = req.body
    let sql = 'DELETE FROM login WHERE user_id = ?'
    db.sqlQuery(sql, [id]).then(() => {
        let response = new Response('删除成功!', 200)
        res.json(response)
    }).catch(err => {
        let response = new Response(err.code, 250)
        res.json(response)
    })
})
module.exports = router