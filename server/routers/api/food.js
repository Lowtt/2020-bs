//食品api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

// 查询火热菜品
router.post('/queryHotFoods', (req, res) => {
    let sql = 'SELECT id,name,sum(num) as num,type,price,url FROM sell_info GROUP BY name ORDER BY num  DESC'
    db.sqlQuery(sql).then(result => {
        let allSql = 'SELECT id,name,num,type,price,url FROM food_info' //查询所有菜品,包括被删除的
        db.sqlQuery(allSql).then(res1 => {
            for (let i = 0; i < res1.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (result[j].name == res1[i].name && res1[i].flag == 0) {//去除"被删除"的菜品
                        result.splice(j, 1)
                        j--
                    }
                }
            }
            if (result.length > 8) {
                let response = new Response('查询成功!', 200, result.map((item, index) => {
                    if (index < 8) {
                        return item
                    }
                }))
                res.json(response)
            } else {
                let response = new Response('查询成功!', 200, result)
                res.json(response)
            }
        })

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
    let sql = 'SELECT id,name,num,type,price,url FROM food_info WHERE type = ? AND flag = 1'
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
    let querySql = 'SELECT name,create_at as createAt,id,type,price,url,num FROM food_info WHERE flag = 1'
    let totalSql = 'SELECT COUNT(*) as total FROM food_info WHERE flag = 1'
    if (name) {
        querySql += `AND name like '%${name}%'`
        totalSql += `AND name like '%${name}%'`
    }
    if (type || type == 0) {
        querySql += ` AND type = ${type}`
        totalSql += ` AND type = ${type}`
    }
    if (startTime && endTime) {

        querySql += ` AND create_at >= "${startTime}" AND create_at <= "${endTime}"`
        totalSql += ` AND create_at >= "${startTime}" AND create_at <= "${endTime}"`
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
            message: err.code
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
    let querySql = 'SELECT * FROM food_info WHERE name = ?'
    let regSql = 'INSERT INTO food_info (name,price,type,url) VALUES (?,?,?,?)'
    db.sqlQuery(querySql, [name]).then(result => {
        if (result.length) {
            let response = new Response('该菜品已存在!', 250)
            res.json(response)
        } else {
            db.sqlQuery(regSql, [name, price, type, url]).then(() => {
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

// 修改菜品
router.post('/updateFood', (req, res) => {
    let {
        name,
        price,
        type,
        url,
        id
    } = req.body
    let updateSql = 'UPDATE food_info SET name = ?,price = ?,type = ?,url = ? WHERE id = ?'
    db.sqlQuery(updateSql, [name, price, type, url, id]).then(() => {
        let response = new Response('修改成功!', 200)
        res.json(response)
    }).catch(err => {
        let response = new Response(err.code, 250)
        res.json(response)
    })
})

// 删除菜品
router.post('/deleteFood', (req, res) => {
    let {

        id
    } = req.body
    let deleteSql = 'UPDATE food_info SET flag = 0 WHERE id = ?'
    db.sqlQuery(deleteSql, [id]).then(() => {
        let response = new Response('删除成功!', 200)
        res.json(response)
    }).catch(err => {
        let response = new Response(err.code, 250)
        res.json(response)
    })
})

module.exports = router