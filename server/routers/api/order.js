// 点餐api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

//创建店里结账订单
router.post('/createOrderList', (req, res) => {
    let {
        price,
        createAt,
        orderInfo
    } = req.body
    let inSql = 'INSERT INTO sell (sell_type,total_money,create_at) VALUES (0,?,?)'
    let newListSql = 'SELECT MAX(id) as newId FROM sell'
    let addInfoSql = 'INSERT INTO sell_info (sell_id,price,num,name,type,url) VALUES (?,?,?,?,?,?)'
    db.sqlQuery(inSql, [price, createAt]).then(() => {
        db.sqlQuery(newListSql).then(result => {
            let newId = result[0].newId
            orderInfo.map((item, index) => {
                db.sqlQuery(addInfoSql, [newId, item.price, item.num, item.name, item.type, item.url]).then(() => {
                    if (index == orderInfo.length - 1) {
                        let response = new Response('结账成功!', 200)
                        res.json(response)
                    }
                }).catch(err => {
                    res.json({
                        code: 250,
                        message: err.code
                    })
                })
            })
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


module.exports = router