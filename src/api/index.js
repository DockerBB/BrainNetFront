import { request } from '@/utils/request'

// 登录
export function getLogin(form) {
    let res = request(window.g.BASE_URL + 'login', 'POST', form)
    return res
}
// 用户信息
export function getUser(token) {
    let res = request(window.g.BASE_URL + 'user', 'GET', token)
    return res
}
// 列表
export function getList() {
    let res = request(window.g.BASE_URL + 'list', 'GET')
    return res
}
