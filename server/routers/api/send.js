//配送api

const express = require('express')
const router = express.Router()
const db = require('../../public/bin/mysql.js')
const Response = require('../../public/utils/response.js')

//查询外卖人员(所有)
router.post('/querySendPerson', (req, res) => {
    let sql = 'SELECT send_id as id,name,tel FROM send_person WHERE flag = 1'
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

//根据页数查找菜品
router.post('/queryPersonByPage', (req, res) => {
    let {
        name,
        pageNum,
        pageSize
    } = req.body
    let querySql = 'SELECT name,create_at as createAt,send_id as id,tel,update_at as updateAt FROM send_person WHERE flag = 1'
    let totalSql = 'SELECT COUNT(*) as total FROM send_person WHERE flag = 1'
    if (name) {
        querySql += ` AND name lIKE '%${name}%'`
        totalSql += ` AND name lIKE '%${name}%'`
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

// 新增配送人员
router.post('/createPerson', (req, res) => {
    let {
        name,
        tel
    } = req.body
    let querySql = 'SELECT * FROM send_person WHERE name = ? AND tel = ? AND flag = 1'
    let regSql = 'INSERT INTO send_person (name,tel) VALUES (?,?)'
    db.sqlQuery(querySql, [name, tel]).then(result => {
        if (result.length) {
            let response = new Response('同名同手机号已存在!', 250)
            res.json(response)
        } else {
            db.sqlQuery(regSql, [name, tel]).then(() => {
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

// 修改配送人员
router.post('/updatePerson', (req, res) => {
    let {
        name,
        tel,
        id
    } = req.body
    let sql = 'UPDATE send_person SET name = ? , tel = ? WHERE send_id = ?'
    db.sqlQuery(sql, [name, tel, id]).then(() => {
        let response = new Response('新增成功!', 200)
        res.json(response)
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })

    })
})

//删除配送人员
router.post('/deletePerson', (req, res) => {
    let {
        id
    } = req.body
    let sql = 'UPDATE send_person SET flag= 0 WHERE send_id = ?'
    db.sqlQuery(sql, [id]).then(() => {
        let response = new Response('删除成功!', 200)
        res.json(response)

    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

// 创建外卖订单
router.post('/createTakeWay', (req, res) => {
    let {
        sendId,
        price,
        takewayInfo
    } = req.body
    let inSql = 'INSERT INTO take_way (send_id,price) VALUES (?,?)'
    let newListSql = 'SELECT MAX(takeway_id) as newId FROM take_way'
    let addInfoSql = 'INSERT INTO take_way_info (take_id,price,num,name,type,url) VALUES (?,?,?,?,?,?)'
    db.sqlQuery(inSql, [sendId, price]).then(() => {
        db.sqlQuery(newListSql).then(result => {
            let newId = result[0].newId
            takewayInfo.map((item, index) => {
                db.sqlQuery(addInfoSql, [newId, item.price, item.num, item.name, item.type, item.url]).then(() => {
                    if (index == takewayInfo.length - 1) {
                        let response = new Response('外卖操作成功!', 200)
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

//查询所有外卖(已存在)
router.post('/queryAllTakeOut', (req, res) => {
    let sql = 'SELECT takeway_id as id,price,send_id as sendId,create_at as createAt FROM take_way WHERE flag = 1'
    let sendSql = 'SELECT name as sendName,tel FROM send_person WHERE send_id = ?'
    db.sqlQuery(sql).then(result => {
        let datas = []
        let len = result.length
        if (len) {
            for (let i = 0; i < len; i++) {
                db.sqlQuery(sendSql, [result[i].sendId]).then(res1 => {
                    let obj = {
                        ...result[i],
                        ...res1[0]
                    }
                    datas.push(obj)
                    if (datas.length === len) {
                        let response = new Response('查询成功!', 200, datas)
                        res.json(response)
                    }

                }).catch(err => {
                    res.json({
                        code: 250,
                        message: err.code
                    })
                })
            }
        } else {
            let response = new Response('查询成功!', 200, datas)
            res.json(response)
        }

    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

//删除外卖订单
router.post('/deleteTakeOut', (req, res) => {
    let {
        id
    } = req.body
    let sql = 'UPDATE take_way SET flag= 2 WHERE takeway_id = ?'
    db.sqlQuery(sql, [id]).then(() => {
        let response = new Response('删除成功!', 200)
        res.json(response)

    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

//外卖订单详情
router.post('/takeOutDetail', (req, res) => {
    let {
        id
    } = req.body
    let sql = 'SELECT name,price,num FROM take_way_info WHERE take_id = ?'
    db.sqlQuery(sql, [id]).then((result) => {
        let response = new Response('查询成功!', 200, result)
        res.json(response)

    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

//外卖订单配送
router.post('/takeOutSend', (req, res) => {
    let {
        id,
        createAt
    } = req.body
    let querySql = 'SELECT name,price,num,type,url FROM take_way_info WHERE take_id = ?' //获取外卖菜品详情
    db.sqlQuery(querySql, [id]).then((result) => {
        let totalMoney = 0
        let inSql = 'INSERT INTO sell (sell_type,total_money,create_at) VALUES (1,?,?)' //售出数据插入售出数据库
        result.map(item => {
            totalMoney += item.price * item.num
        })
        db.sqlQuery(inSql, [totalMoney, createAt]).then(() => {
            let newListSql = 'SELECT MAX(id) as newId FROM sell' //获取最新插入数据id
            db.sqlQuery(newListSql).then(res1 => {
                let newId = res1[0].newId
                let addInfoSql = 'INSERT INTO sell_info (name,price,num,sell_id,type,url) VALUES (?,?,?,?,?,?)'
                result.map((item, index) => {
                    db.sqlQuery(addInfoSql, [item.name, item.price, item.num, newId, item.type, item.url]).then(() => {
                        if (index == result.length - 1) {
                            let sql = 'UPDATE take_way SET flag= 2 WHERE takeway_id = ?'
                            db.sqlQuery(sql, [id]).then(() => {
                                let response = new Response('配送成功!', 200)
                                res.json(response)
                            }).catch(err => {
                                res.json({
                                    code: 250,
                                    message: err.code
                                })
                            })
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
    }).catch(err => {
        res.json({
            code: 250,
            message: err.code
        })
    })
})

module.exports = router