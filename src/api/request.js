import axios from 'axios'
import {ElMessage} from 'element-plus'
import {useAppSettingsStore} from '@/stores/appSettings.js'

axios.defaults.withCredentials = true

// 创建axios实例
const service = axios.create({
  timeout: 60000,
  maxRedirects: 0,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// request拦截器
service.interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_TEST_TOKEN_ENABLE === 'true') {
      config.headers['x-userinfo'] = import.meta.env.VITE_TEST_TOKEN
    }
    const appSettingsStore = useAppSettingsStore()
    if (appSettingsStore.lang) {
      config.headers['accept-language'] = appSettingsStore.lang.replace('_', '-') + ';q=0.9,en;q=0.8'
    }
    return config
  },
  (error) => {
    ElMessage({
      message: error.message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)
// respone拦截器
service.interceptors.response.use(
  (response) => {
    if (response.headers['content-type']?.includes('text/html')) {
      if (response.data?.includes('/platformSvr/login')) {
        console.log('reload the total page.')
        window.location.reload()
        return Promise.reject()
      }
    }
    /**
     * status [200,500) 请求为正确响应，[500, +] 响应有错误
     */
    const res = response.data
    if (res !== undefined && res.status !== undefined && res.status !== 200) {
      ElMessage({
        message: res.description,
        type: 'error'
      })
      return Promise.reject(res)
    } else {
      // 判断如果是Excel导出文件类操作，把整个response返给调用函数
      const disposition = response.headers['content-disposition']
      if (disposition !== undefined && disposition.includes('attachment')) {
        return response
      } else {
        return response.data
      }
    }
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误，必填参数缺失'
          break
        case 401:
          error.message = '未授权，身份验证失败'
          break
        case 403:
          error.message = '拒绝访问，没有接口访问权限'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 408:
          error.message = '请求超时'
          break
        case 422:
          error.message = '参数校验失败'
          break
        case 500:
          error.message = '服务器错误'
          break
        case 502:
          error.message = '网关或代理服务器错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        default:
          window.location.reload()
      }
    }
    ElMessage({
      message: error.message,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export default service
