//首页图表api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')
const moment = require('moment')
// 查询上月最热门食品
router.post('/queryLastHotFoods', (req, res) => {
    let {
        date
    } = req.body
    let sql = `SELECT name,sum(num) as value FROM sell_info WHERE create_at like '%${date}%' GROUP BY name ORDER BY num  DESC LIMIT 0,5`
    db.sqlQuery(sql).then(result => {
        let nameArr = []
        let numArr = []
        result.map(item => {
            nameArr.push(item.name)
            numArr.push(item.value)
        })
        let response = new Response('查询成功!', 200, [nameArr, numArr, result])
        res.json(response)
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

// 查询过去7天营业额及食品大类销售量(通过参数isPrice区分)
router.post('/queryLastWeek', (req, res) => {
    let {
        startTime,
        endTime,
        isPrice
    } = req.body
    let sql = `SELECT type,sum(num) as totalNum,price,DATE_FORMAT(create_at,'%Y-%m-%d') as createAt FROM sell_info WHERE create_at >= ? AND create_at <= ? GROUP BY type,createAt ORDER BY create_at ASC`
    db.sqlQuery(sql, [startTime, endTime]).then(result => {
        let date = [...Array(7).keys()].map(day => {
            return {
                createAt: moment(new Date(Date.now() - 86400000 * (day + 1))).format("YYYY-MM-DD"),
                income: 0
            }
        }).reverse()
        let arr = []
        for (let i = 0; i < 7; i++) {
            arr.push(0)
        }
        let endResult = [arr.concat(), arr.concat(), arr.concat(), arr.concat()] //第0个代表主食,第1个代表小食,第2个代表饮料,第3个代表套餐
        date.map((item, index) => {
            result.map(it => {
                if (item.createAt + '' == it.createAt + '') {
                    if (isPrice) { //查询收入
                        item.income += it.totalNum * it.price
                    } else {
                        //查询食品大类销售量
                        // 日期相等,将查询出的结构对应类型it.type放置对应的第index天
                        endResult[it.type][index] = it.totalNum
                    }

                }
            })
        })

        if (isPrice) {
            //是查询收入
            let response = new Response('查询成功!', 200, date)
            res.json(response)
        } else {
            let totalArr = []
            for (let i = 0; i < 7; i++) {
                let total = 0
                endResult.map(item => {
                    total += item[i]
                })
                totalArr.push(total)
            } //求和
            endResult.push(totalArr)
            let response = new Response('查询成功!', 200, endResult)
            res.json(response)
        }

    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})


// 查询当天小时订单数
router.post('/queryTodayOrderNums', (req, res) => {
    let {
        startTime,
        endTime
    } = req.body
    let arr = []
    for (let i = 0; i < 24; i++) {
        if (i < 10) {
            i = '0' + i
        }
        let obj = {
            createAt: moment().format(`YYYY-MM-DD ${i}`),
            data: null
        }
        arr.push(obj)
    }
    let sql = `SELECT sum(num) as totalNum,price,DATE_FORMAT(create_at,'%Y-%m-%d %k') as createAt FROM sell_info WHERE create_at >= ? AND create_at <= ? GROUP BY createAt ORDER BY create_at ASC`
    db.sqlQuery(sql, [startTime, endTime]).then(result => {
        result.map(item => {
            arr.map(it => {
                if (item.createAt + '' == it.createAt + '') {
                    it.data = item.totalNum
                }
            })
        })
        let arr1 = arr.map(item => item.data)
        let response = new Response('查询成功!', 200, arr1)
        res.json(response)
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

module.exports = router