const express = require('express')
const router = express.Router()
const db = require('../mysql/mysql.js')

router.get('/login', (req, res) => {
    let sql = 'SELECT * FROM bishe.login'
    db.sqlQuery(sql).then(result => {
        res.json({
            status: 200,
            message: '请求成功!',
            data: result
        })
    }).catch(err => {
        res.json({
            status: 250,
            message: '请求失败!' + err
        })
    })
})
module.exports = router