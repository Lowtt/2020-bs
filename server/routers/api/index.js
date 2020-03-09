//首页api(一月内最受欢迎,过去一周食品大类,当天小时订单数,过去一周营业额)

const express = require('express')
const jwt = require('jsonwebtoken') //token验证
const router = express.Router()
const db = require('../mysql/mysql.js')
const Response = require('../response/response.js')