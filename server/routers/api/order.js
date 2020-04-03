// 点餐api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

// 查询火热菜品
router.post('/queryHotFoods', (req, res) => {
    let sql = 'SELECT * FROM food_info ORDER BY num  DESC LIMIT 0,5'
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
    let sql = 'SELECT * FROM food_info WHERE type = ?'
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



module.exports = router