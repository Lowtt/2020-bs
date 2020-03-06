const mysql = require("mysql");
// const db = mysql.createConnection({
//     host: "localhost", ///数据库URL
//     port: "3306", //数据库端口，默认3306
//     user: "admin",
//     password: "admin"
// });
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'admin',
    password: 'admin',
    port: '3306',
    connectionLimit: 100, //最大连接数
})

// sql查询语句
const sqlQuery = (sql, condition) => {
    return new Promise((resolve, reject) => {
        dbPool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                if (condition) {
                    connection.query(sql, condition, (err, res) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(res)
                        }
                        connection.release()
                    })
                } else {
                    connection.query(sql, (err, res) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(res)
                        }
                        connection.release()
                    })
                }
            }
        })
    })
}
module.exports = {
    sqlQuery
}