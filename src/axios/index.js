/* eslint-disable */
import axios from 'axios'
import Store from '../store'
import ElementUI from 'element-ui'
import Router from '../router'

axios.defaults.baseURL = 'http:' + window.g.API_URL
axios.defaults.withCredentials = true
axios.interceptors.response.use(
  response => {
    if (response.headers['content-type'].indexOf('application/json') >= 0 && response.data.status !== 0) {
      console.log(response)
      //登录失败不进行弹窗显示
      if (response.data.status !== 666) {
        ElementUI.Message.warning(response.data.message)
      }
      if (response.data.status === 401 || response.data.status === 403) {
          Store.commit('SET_LOGOUT')
          Router.push('/login')
      }
    }
    return response
  },
  error => {
    console.log('请求失败', error)
    ElementUI.Message.error(error.message + ' : ' + error.request.responseURL)
    if (error.response.status === 401 || error.response.status === 403) {
        Store.commit('SET_LOGOUT')
        Router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axios
