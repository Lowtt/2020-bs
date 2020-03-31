//食品api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

// 查询火热菜品
router.post('/queryHotFoods', (req, res) => {
    let sql = 'SELECT * FROM foodInfo ORDER BY num  DESC LIMIT 0,4'
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

// 根据菜品类型查询
router.post('/queryFoodsByType', (req, res) => {
    let {
        type
    } = req.body
    let sql = 'SELECT * FROM foodInfo WHERE type = ?'
    db.sqlQuery(sql, [type]).then(result => {
        let response = new Response('查询成功!', 200, result)
        res.json(response)
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

//根据页数查找菜品
router.post('/queryFoodsByPage', (req, res) => {
    let {
        name,
        type,
        startTime,
        endTime,
        pageNum,
        pageSize
    } = req.body
    let querySql = 'SELECT name,create_at as createAt,id,type,price,url,num FROM foodInfo '
    let totalSql = 'SELECT COUNT(*) as total FROM foodInfo '
    if (name) {
        querySql += `WHERE name like '%${name}%'`
        totalSql += `WHERE name like '%${name}%'`
    }
    if (type || type == 0) {
        querySql += name ? ` and type = ${type}` : `WHERE type = ${type}`
        totalSql += name ? ` and type = ${type}` : `WHERE type = ${type}`
    }
    if (startTime && endTime) {
        querySql += type || type == 0 || name ? ` and create_at >= "${startTime}" and create_at <= "${endTime}"` : `WHERE create_at >= "${startTime}" and create_at <= "${endTime}"`

    }
    querySql += ` ORDER BY createAt DESC LIMIT ${(pageNum-1)*pageSize},${pageSize}`
    db.sqlQuery(querySql).then(result => {
        db.sqlQuery(totalSql).then(res1 => {
            let data = {
                data: result,
                pageNum: pageNum,
                pageSize: pageSize,
                total: res1[0].total
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
            message: err
        })
    })
})

// 新增菜品
router.post('/createFood', (req, res) => {
    let {
        name,
        price,
        type,
        url
    } = req.body
    let querySql = 'SELECT * FROM foodInfo WHERE name = ?'
    let regSql = 'INSERT INTO foodInfo (name,price,type,url,num) VALUES (?,?,?,?,1)'
    db.sqlQuery(querySql, [name]).then(result => {
        if (result.length) {
            let response = new Response('该菜品已存在!', 250)
            res.json(response)
        } else {
            db.sqlQuery(regSql, [name, price, type, url]).then(() => {
                let response = new Response('新增成功!', 200)
                res.json(response)
            }).catch(err => {
                let response = new Response(err, 250)
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

module.exports = router