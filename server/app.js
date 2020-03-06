const express = require('express')
const app = express()
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

let arr = []

function createData(id) {
    let heroes = ['张三', '李四', '王五', '赵六', '钱七', '路人甲', '路人乙', 'bruse Lee'];
    return {
        id: id,
        name: heroes[Math.floor(Math.random() * 7)],
        age: Math.floor(Math.random() * 100)

    };

}
for (var i = 0; i < 10; i++) {
    arr.push(createData(i));
}

app.get('/api/testData', (req, res) => {
    res.status(200),
        res.json({ message: '请求成功!', data: arr })
});

app.listen(3000)