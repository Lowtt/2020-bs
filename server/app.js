const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const loginRouter = require('./routers/api/login.js')
const app = express()
    // app.all('*', (req, res, next) => {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //     res.header("X-Powered-By", ' 3.2.1');
    //     res.header("Content-Type", "application/json;charset=utf-8");
    //     next();
    // });
app.use(cors()) //解决跨域
app.use(bodyParser.json()) //解析表单数据,post:req.body;get:req.query
app.use('/api/0/user', loginRouter)
app.listen(3000)