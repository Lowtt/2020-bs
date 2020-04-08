//报表api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')





function createSql(param, startTime, endTime, who) {
    return ` ${param} create_at >= "${startTime}" and create_at <= "${endTime}" GROUP BY ${who} `
}
//根据页数查找菜品销量
router.post('/queryFoodSellByPage', (req, res) => {
    let {
        name,
        type,
        startTime,
        endTime,
        pageNum,
        pageSize
    } = req.body
    let querySql = 'SELECT name,create_at as createAt,id,type,price,sum(num) as totalNum FROM sell_info '
    let totalSql = 'SELECT COUNT(*) as total FROM sell_info '
    if (name) {
        querySql += `WHERE name like '%${name}%'`
        totalSql += `WHERE name like '%${name}%'`
    }
    if (type || type == 0) {
        querySql += name ? ` and type = ${type}` : `WHERE type = ${type}`
        totalSql += name ? ` and type = ${type}` : `WHERE type = ${type}`
    }
    if (startTime && endTime) {
        querySql += type || type == 0 || name ? createSql('and', startTime, endTime, "name") : createSql('WHERE', startTime, endTime, "name")
        totalSql += type || type == 0 || name ? createSql('and', startTime, endTime, "name") : createSql('WHERE', startTime, endTime, "name")
    }
    querySql += ` ORDER BY totalNum DESC LIMIT ${(pageNum-1)*pageSize},${pageSize}`
    db.sqlQuery(querySql).then(result => {
        db.sqlQuery(totalSql).then(res1 => {
            let data = {
                data: result,
                pageNum: pageNum,
                pageSize: pageSize,
                total: res1.length
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

// 营业额
///////?????????????????????????????????????????????????????????????????????????

router.post('/queryMakeMoney', (req, res) => {
    let {

        startTime,
        endTime,

    } = req.body
    let oneSql = `SELECT total_money as totalMoney,create_at as createAt,sell_type as sellType FROM sell ${createSql('WHERE',startTime,endTime,'create_at')}`
    let querySql = `SELECT sellType,createAt,sum(totalMoney) FROM (${oneSql}) as aaaa ORDER BY createAt DESC`
console.log(oneSql)
    db.sqlQuery(oneSql).then(result => {

        let response = new Response('查询成功!', 200, result)
        res.json(response)

    }).catch(err => {
        res.json({
            code: 250,
            message: err
        })
    })
})

module.exports = router