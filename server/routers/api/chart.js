//首页图表api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

// 查询上月最热门食品
router.post('/queryLastHotFoods', (req, res) => {
    let{
        startTime,endTime
    } = req.body
    let sql = `SELECT name,update_at,num FROM foodInfo WHERE upate_at >= "${startTime}" and upate_at <= "${endTime}" and num > 1 ORDER BY num  DESC LIMIT 0,5`
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

module.exports = router
