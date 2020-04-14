// 系统的所有接口

import request from './request'
const baseUrl = "http://localhost:3000"

const requestWrapper = (method, url, params = {}) => {
  return new Promise((resolve, reject) => {
    request[method](url, params).then(res => {
      resolve(res)
    })
  })
}
export const url = baseUrl
// 登录 
export const login = params => requestWrapper('post', `${baseUrl}/api/user/login`, params)

// 修改密码
export const changePassWord = params => requestWrapper('post', `${baseUrl}/api/user/changePassword`, params)

// 注册
export const regUser = params => requestWrapper('post', `${baseUrl}/api/user/regUser`, params)

// 火热菜品
export const queryHotFoods = params => requestWrapper('post', `${baseUrl}/api/food/queryHotFoods`, params)

// 上月菜品top5
export const queryLastHotFoods = params => requestWrapper('post', `${baseUrl}/api/chart/queryLastHotFoods`, params)

// 过去7天食品大类销售量(及营业额,通过参数isPrice判断)
export const queryLastWeek = params => requestWrapper('post', `${baseUrl}/api/chart/queryLastWeek`, params)

// 当天订单数量(每小时)
export const queryTodayOrder = params => requestWrapper('post', `${baseUrl}/api/chart/queryTodayOrderNums`, params)

// 菜品分类
export const queryFoodType = params => requestWrapper('post', `${baseUrl}/api/food/queryFoodsByType`, params)

// 菜品分页查询
export const queryFoodsByPage = params => requestWrapper('post', `${baseUrl}/api/food/queryFoodsByPage`, params)

// 菜品新增
export const createFood = params => requestWrapper('post', `${baseUrl}/api/food/createFood`, params)

// 菜品修改
export const updateFood = params => requestWrapper('post', `${baseUrl}/api/food/updateFood`, params)

// 菜品删除
export const deleteFood = params => requestWrapper('post', `${baseUrl}/api/food/deleteFood`, params)

// 查询配送人员(所有)
export const querySendPerson = params => requestWrapper('post', `${baseUrl}/api/send/querySendPerson`, params)

// 查询配送人员(分页)
export const queryPersonByPage = params => requestWrapper('post', `${baseUrl}/api/send/queryPersonByPage`, params)

// 创建配送人员
export const createPerson = params => requestWrapper('post', `${baseUrl}/api/send/createPerson`, params)

// 修改配送人员
export const updatePerson = params => requestWrapper('post', `${baseUrl}/api/send/updatePerson`, params)

// 删除配送人员
export const deletePerson = params => requestWrapper('post', `${baseUrl}/api/send/deletePerson`, params)

//创建外卖订单
export const createTakeWay = params => requestWrapper('post', `${baseUrl}/api/send/createTakeWay`, params)

//查询所有外卖订单
export const queryTakeWay = params => requestWrapper('post', `${baseUrl}/api/send/queryAllTakeOut`, params)

//删除外卖订单
export const deleteTakeWay = params => requestWrapper('post', `${baseUrl}/api/send/deleteTakeOut`, params)

//外卖订单详情
export const takeWayDetail = params => requestWrapper('post', `${baseUrl}/api/send/takeOutDetail`, params)

//外卖订单配送
export const takeWaySend = params => requestWrapper('post', `${baseUrl}/api/send/takeOutSend`, params)

//结账
export const createOrder = params => requestWrapper('post', `${baseUrl}/api/order/createOrderList`, params)

//查询月销量
export const queryMakeMoney = params => requestWrapper('post', `${baseUrl}/api/report/queryMakeMoney`, params)

//查询食品销量
export const queryFoodSell = params => requestWrapper('post', `${baseUrl}/api/report/queryFoodSellByPage`, params)

//创建用户
export const createUser = params => requestWrapper('post', `${baseUrl}/api/system/createUser`, params)

//查询用户
export const queryUser = params => requestWrapper('post', `${baseUrl}/api/system/queryUser`, params)

//修改用户
export const updateUser = params => requestWrapper('post', `${baseUrl}/api/system/updateUser`, params)

//删除用户
export const deleteUser = params => requestWrapper('post', `${baseUrl}/api/system/deleteUser`, params)
