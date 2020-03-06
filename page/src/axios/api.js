import request from './request'

//const baseUrl = 'http://106.75.97.26:8888/dms'
//const baseUrl = 'http://daduo.natapp1.cc/workers'
// const baseUrl = 'http://daduo2.natapp1.cc/workers'
const baseUrl = "http://106.75.97.26:8999/workers"

const requestWrapper = (method, url, params = {}) => {
    return new Promise((resolve, reject) => {
        request[method](url, params).then(res => {
            resolve(res)
        })
    })
}
export const url = baseUrl
    // 登录 post
export const login = params => requestWrapper('post', `${baseUrl}/api/user/login`, params)

// 修改密码
export const changePassWord = params => requestWrapper('post', `${baseUrl}/api/user/updatePassword`, params)

//个人信息(首页)
export const userInfo = params => requestWrapper('post', `${baseUrl}/api/user/getCurrentTeacher`, params)

//个人绩分相关(首页)
export const userScroll = params => requestWrapper('post', `${baseUrl}/api/teacher/home/getInfo`, params)

//我的班级(首页)
export const userClass = params => requestWrapper('post', `${baseUrl}/teacher/myClass/fistMyClass`, params)

//查询班级(下拉框)
export const queryClass = params => requestWrapper('post', `${baseUrl}/api/user/getClasses`, params)

//个人绩分排名
export const scrollRanke = params => requestWrapper('post', `${baseUrl}/api/teacher/ranking/getListRank`, params)

//部门绩分排名
export const departmentRanke = params => requestWrapper('post', `${baseUrl}/api/teacher/ranking/getMineAndListRankByDeparmentId`, params)

//关卡申请
export const passRequest = params => requestWrapper('post', `${baseUrl}/teacher/checkpoint/update`, params)

//部门查询
export const queryDepartment = params => requestWrapper('post', `${baseUrl}/api/performance/department/allList`, params)

//排名导出(部门,个人)
export const exportRanke = params => requestWrapper('post', `${baseUrl}/api/teacher/ranking/excelList`, params)

//加分记录
export const addScrollRecord = params => requestWrapper('post', `${baseUrl}/api/teacher/applicationIntegralRecord/list`, params)

//加分记录详情
export const addScrollDetail = params => requestWrapper('post', `${baseUrl}/api/teacher/applicationIntegralRecord/listOne`, params)

//减分记录
export const decScrollRecord = params => requestWrapper('post', `${baseUrl}/api/teacher/applicationIntegralRecord/cutList`, params)

//日常扣分详情
export const dailyDec = params => requestWrapper('post', `${baseUrl}/api/teacher/applicationIntegralRecord/cutList`, params)

//请假规则配置添加
export const saveLeaveRule = params => requestWrapper('post', `${baseUrl}/teacher/leaveRule/save`, params)

//闯关模板下载 get /teacher/entryTemplate/list
export const download = params => requestWrapper('get', `${baseUrl}/teacher/entryTemplate/list`, params)

//上传模板 post /upload/file
export const upEntry = params => requestWrapper('post', `${baseUrl}/upload/file`, params)

//入职上传记录添加 post /teacher/entryApply/save
export const addRecord = params => requestWrapper('post', `${baseUrl}/teacher/entryApply/save`, params)

// 我的闯关 /teacher/checkpoint/list
export const checkpointList = params => requestWrapper('post', `${baseUrl}/teacher/checkpoint/list`, params)
    // 闯关审核 /teacher/checkpoint/update
export const checkpointUpdate = params => requestWrapper('post', `${baseUrl}/teacher/checkpoint/update`, params)

// 请假列表 /teacher/leaveApply/listPage
export const leaveList = params => requestWrapper('post', `${baseUrl}/teacher/leaveApply/listPage`, params)

// 请假申请 /teacher/leaveApply/save
export const leaveApply = params => requestWrapper('post', `${baseUrl}/teacher/leaveApply/save`, params)

// 请假导出 /teacher/leaveApply/excel
export const exportExcel = params => requestWrapper('post', `${baseUrl}/teacher/leaveApply/excel`, params)

// 我的班级 /teacher/myClass/list
export const myClassList = params => requestWrapper('post', `${baseUrl}/teacher/myClass/list`, params)

// 我的班级详情详情(详情后再次点击详情)
export const classDetail = params => requestWrapper('post', `${baseUrl}/consumeTeaching/getConsumeTeachingByStudentId`, params)

// 我的班级--头部数据
export const headData = params => requestWrapper('post', `${baseUrl}/teacher/myClass/classesDetailsByclassId`, params)

// 我的班级--课时提成
export const classUp = params => requestWrapper('post', `${baseUrl}/teacher/myClass/listStudentByClassesId`, params)



// 我的班级--提成明细
export const getUpDetail = params => requestWrapper('post', `${baseUrl}/api/user/getStudentByClassesId`, params)

// 我的班级统计 /teacher/myClass/listTeachingCount
export const listTeachingCount = params => requestWrapper('post', `${baseUrl}/teacher/myClass/listTeachingCount`, params)

// 查询学段 /api/user/getLearningtime
export const getLearningtime = params => requestWrapper('post', `${baseUrl}/api/user/getLearningtime`, params)

// 查询年纪 /api/user/getGradeListapi/user/getGradeList
export const getGrade = params => requestWrapper('post', `${baseUrl}/api/user/getGradeList`, params)

// 查询班级 /api/user/getClasses

// 查询学段 /api/user/getclassType

export const queryLarning = params => requestWrapper('post', `${baseUrl}/api/user/getLearningtime`, params)

// 教学安排
export const myTeachingArrange = params => requestWrapper('post', `${baseUrl}/teacher/myClass/myTeachingArrange`, params)


// 教学总结
export const teachingSummary = params => requestWrapper('post', `${baseUrl}/teacher/teachingSummary/listPage`, params)

// 教学总结(上传文件)
export const upFile = params => requestWrapper('post', `${baseUrl}/teacher/teachingSummary/save`, params)

// 教学总结(下载文件)
export const downloadFile = params => requestWrapper('post', `${baseUrl}/teacher/teachingRule/list`, params)

// 公告
export const announcementList = params => requestWrapper('post', `${baseUrl}/announcement/listPage`, params)

// 公告详情
export const noticeDeatil = params => requestWrapper('get', `${baseUrl}/announcement/listOne?announcementId=${params.id}`, params)

// 查询教师列表
export const teacherList = params => requestWrapper('post', `${baseUrl}/api/user/getTeacher`, params)


// 站内消息 // /message/listPage
export const messagelistPage = params => requestWrapper('post', `${baseUrl}/message/listPage`, params)
    // 查看站内消息
export const messageDetail = params => requestWrapper('get', `${baseUrl}/message/listOne?messageId=${params.id}`, params)


// 发文件
export const sendFile = params => requestWrapper('post', `${baseUrl}/sendToFile/save`, params)


// 举报 /report/listPage
export const reportlist = params => requestWrapper('post', `${baseUrl}/report/listPage`, params)
    // 向ceo举报
export const reportToCeo = params => requestWrapper('post', `${baseUrl}/report/save`, params)
    //静态绩分模板list
export const staticTemplateList = params => requestWrapper('post', `${baseUrl}/api/performance/staticTemplate/list`, params)

//申请绩分
export const applicationIntegralRecordSave = params => requestWrapper('post', `${baseUrl}/api/teacher/applicationIntegralRecord/save`, params)


//   获取学校
export const schooolList = params => requestWrapper('post', `${baseUrl}/api/schoool/list`, params)
    // 导出EXCEL
export const DownLoade = (url, params) => requestWrapper('downLoadExcel', `${baseUrl}${url}`, params)


// 查看学生名单 // /api/user/getStudentByClassesId

export const studentList = params => requestWrapper('post', `${baseUrl}/api/user/getStudentByClassesId`, params)