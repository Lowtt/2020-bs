// 接口返回统一格式
class Response {
    // msg:返回提示;code:请求状态;data:返回数据
    constructor(msg, code, data) {
        this.message = msg;
        this.code = code;
        this.data = data
    }
}
module.exports = Response