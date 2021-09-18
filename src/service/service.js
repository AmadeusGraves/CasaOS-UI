import axios from 'axios'
import qs from 'qs'
import router from '@/router'
import store from '@/store'
// Set Post Headers
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = false;
if (process.env.NODE_ENV === "'dev'") {
    axios.defaults.baseURL = 'http://192.168.2.217:8089/v1'
} else {
    axios.defaults.baseURL = document.location.protocol + "//" + document.domain + ":" + window.g.PORT + "/v1"
}

//Create a axios instance, And set timeout to 30s
const instance = axios.create({
    timeout: 10000,
});

// Request interceptors
instance.interceptors.request.use((config) => {
    let token = ''
    if (sessionStorage.getItem("user_token")) {
        token = sessionStorage.getItem("user_token")
    }
    if (localStorage.getItem("user_token")) {
        token = localStorage.getItem("user_token")
    }

    config.headers.Authorization = 'Bearer ' + token
    store.commit('setToken', token)
    //console.log("请求拦截", config);
    return config;
}, (error) => {
    // Do something with request error
    return Promise.reject(error)
})

// 响应拦截（请求返回后拦截）
instance.interceptors.response.use(response => {
    //console.log("响应拦截", response);
    return response;
}, error => {
    console.log('catch', error)
    if (error.response) {

        switch (error.response.status) {
            case 401:
                sessionStorage.removeItem('user_token') //可能是token过期，清除它
                router.replace({ //跳转到登录页面
                    path: '/',
                    query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
                })
                break;
            case 404:
                store.commit('setServiceError',true);
                break;
            case 500:
                break;
        }
    } else {
        
        store.commit('setServiceError',true);
    }
    return Promise.reject(error)
})

//按照请求类型对axios进行封装
const api = {
    get(url, data) {
        return instance.get(url, { params: data })
    },
    post(url, data) {
        let newData = (url.indexOf("install") > 0) ? JSON.stringify(data) : qs.stringify(data)
        if (url.indexOf("install") > 0) {
            axios.defaults.headers.post['Content-Type'] = 'application/json';
        } else {
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        return instance.post(url, newData)
    },
    put(url, data) {
        let newData = (url.indexOf("setting") > 0) ? JSON.stringify(data) : qs.stringify(data)
        if (url.indexOf("setting") > 0) {
            axios.defaults.headers.post['Content-Type'] = 'application/json';
        } else {
            axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
        }
        return instance.put(url, newData)
    },
    delete(url, data) {
        return instance.delete(url, { params: data })
    }
}
export { api }
