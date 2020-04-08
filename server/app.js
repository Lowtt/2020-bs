const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const loginRouter = require('./routers/api/login.js')
const foodRouter = require('./routers/api/food.js')
const sendRouter = require('./routers/api/send.js')
const userRouter = require('./routers/api/user.js')
const chartRouter = require('./routers/api/chart.js')
const orderRouter = require('./routers/api/order.js')
const reportRouter = require('./routers/api/report.js')
const jwt = require('./public/utils/jwt.js')
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
app.use(function(req, res, next) { //token验证
    if (req.url.indexOf('/api/user') == -1) { //去掉登录,注册及修改密码的验证
        let token = req.headers.token;
        let result = jwt.verifyToken(token);
        if (result == 'err') {
            // res.status(401)
            res.json({
                code: 401,
                message: 'token过期,请重新登录!'
            })
            
        } else {
            next();
        }
    } else {
        next();
    }
});
app.use('/api/user', loginRouter)
app.use('/api/food', foodRouter)
app.use('/api/send', sendRouter)
app.use('/api/system', userRouter)
app.use('/api/chart', chartRouter)
app.use('/api/order', orderRouter)
app.use('/api/report', reportRouter)
app.listen(3000)