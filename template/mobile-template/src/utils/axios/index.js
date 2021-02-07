import axios from 'axios'
import { Toast } from 'vant'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 30 * 1000 // 超时时间
})

// response 拦截器
service.interceptors.response.use(
  res => {
    if (res.status !== 200) {
      Toast({
        type: 'fail',
        duration: 2 * 1000,
        message: res.data.msg || '请求失败'
      })
      return Promise.reject(new Error(res.data.msg || '请求失败'))
    } else {
      return Promise.resolve(res.data)
    }
  },
  error => {
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service
