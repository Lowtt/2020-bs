import axios from 'axios'


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
axios.interceptors.response.use(function(response) {
    if (response.data.code != 3600) {
        return response;
    } else {
        this.$message.error('用户信息过期，请重新登录!');
        this.$router.replace('/login')
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