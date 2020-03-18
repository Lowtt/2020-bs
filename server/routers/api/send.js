//配送api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

//查询外卖人员
router.post('/querySendPerson', (req, res) => {
    let sql = 'SELECT send_id as sendId,name,tel FROM sendPerson'
    db.sqlQuery(sql).then(result => {
        let response = new Response('查询成功!', 200, result)
        res.json(response)
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

router.post('/createTakeWay', (req, res) => {
    console.log(req.body)
})

module.exports = router