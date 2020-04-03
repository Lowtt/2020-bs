//首页图表api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

// 查询上月最热门食品
router.post('/queryLastHotFoods', (req, res) => {
    let {
        startTime,
        endTime
    } = req.body
    let sql = `SELECT name,num as value FROM food_info WHERE update_at >= "${startTime}" and update_at <= "${endTime}" ORDER BY num  DESC LIMIT 0,5`
    db.sqlQuery(sql).then(result => {
        let nameArr = []
        let numArr = []
        result.map(item=>{
            nameArr.push(item.name)
            numArr.push(item.value)
        })
        let response = new Response('查询成功!', 200, [nameArr,numArr,result])
        res.json(response)
    }).catch(err => {
        res.json({
            code: 250,
            message: err
        })
    })
})

// 查询上月最热门食品
router.post('/queryLastHotFoods', (req, res) => {
    let {
        startTime,
        endTime
    } = req.body
    let sql = `SELECT name,num as value FROM food_info WHERE update_at >= "${startTime}" and update_at <= "${endTime}" ORDER BY num  DESC LIMIT 0,5`
    db.sqlQuery(sql).then(result => {
        let nameArr = []
        let numArr = []
        result.map(item=>{
            nameArr.push(item.name)
            numArr.push(item.value)
        })
        let response = new Response('查询成功!', 200, [nameArr,numArr,result])
        res.json(response)
    }).catch(err => {
        res.json({
            code: 250,
            message: err
        })
    })
})

// 查询上周食品大类销售量
router.post('/queryLastWeekNum', (req, res) => {
    let {
        startTime,
        endTime
    } = req.body
    // select uid, sum(money) as total from tb_user_finance group by uid order by total desc limit 10;
    let sql = `SELECT name,num as value FROM food_info WHERE update_at >= "${startTime}" and update_at <= "${endTime}" ORDER BY num  DESC LIMIT 0,5`
    db.sqlQuery(sql).then(result => {
        let nameArr = []
        let numArr = []
        result.map(item=>{
            nameArr.push(item.name)
            numArr.push(item.value)
        })
        let response = new Response('查询成功!', 200, [nameArr,numArr,result])
        res.json(response)
    }).catch(err => {
        res.json({
            code: 250,
            message: err
        })
    })
})

module.exports = router