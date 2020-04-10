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

router.post('/queryMakeMoney', (req, res) => {
    let {
        startTime,
        endTime
    } = req.body
    let sql = "SELECT sum(total_money) as totalMoney,sell_type as sellType,create_at as createAt FROM sell where create_at >=? and create_at <=? GROUP BY sell_type,create_at"
    db.sqlQuery(sql, [startTime, endTime]).then(result => {
        for (let i = 0; i < result.length; i++) {
            let obj = {
                createAt: result[i].createAt,
                outMoney: result[i].sellType ? result[i].totalMoney : 0,
                inMoney: result[i].sellType ? 0 : result[i].totalMoney
            }
            result[i] = obj
        }
        for (let i = 0; i < result.length; i++) {
            for (let j = i + 1; j < result.length; j++) {
                if (result[i].createAt + '' == result[j].createAt + '') {
                    result[i].outMoney += result[j].outMoney
                    result[i].inMoney += result[j].inMoney
                    result.splice(j, 1)
                    j--
                }
            }
        }
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