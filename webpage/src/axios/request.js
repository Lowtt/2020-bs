import axios from 'axios'
import {notification} from 'ant-design-vue';

axios.interceptors.request.use(config => {
    const userInfo = sessionStorage.getItem('userInfo');
    if (!userInfo) return config
    try {
        const userInfoObj = JSON.parse(userInfo);
        config.headers.common['token'] = userInfoObj.token
    } catch (e) {
        config.headers.common['token'] = ''
    }
    return config
}, error => {
    return Promise.reject(error)
})

// 判断token过期
let self = this
axios.interceptors.response.use(function(response) {
    if (response.data.code == 401) {
        notification.error({
            message: 'token错误',
            description: '请重新登录'
          })
        window.location.href='http://localhost:8080/#/login'
    } else {
        return response;
    }
}, function(error) {
    return Promise.reject(error);
});


export default {
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                params
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    post(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, data).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    put(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.put(url, data).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    patch(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.patch(url, data).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    delete(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.delete(url, data).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    downLoadExcel(url, data = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, data, {
                responseType: 'blob'
            }).then(res => {
                resolve(res.data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}